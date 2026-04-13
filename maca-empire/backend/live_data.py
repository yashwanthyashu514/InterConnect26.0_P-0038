import os
import httpx
from datetime import datetime
from zoneinfo import ZoneInfo
from dotenv import load_dotenv

load_dotenv()

COINGECKO_BASE = 'https://api.coingecko.com/api/v3'
EXCHANGERATE_BASE = 'https://api.exchangerate-api.com/v4/latest/USD'

COIN_ID_MAP = {
    'BTC': 'bitcoin', 'ETH': 'ethereum', 'BNB': 'binancecoin',
    'SOL': 'solana', 'XRP': 'ripple', 'ADA': 'cardano',
    'DOGE': 'dogecoin', 'MATIC': 'matic-network', 'DOT': 'polkadot',
    'SHIB': 'shiba-inu', 'AVAX': 'avalanche-2', 'LINK': 'chainlink',
    'UNI': 'uniswap', 'LTC': 'litecoin', 'ATOM': 'cosmos'
}

async def fetch_live_crypto_price(symbol: str) -> dict:
    symbol_upper = symbol.upper().replace('USDT', '').strip()
    coin_id = COIN_ID_MAP.get(symbol_upper, symbol_upper.lower())

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(
                f'{COINGECKO_BASE}/simple/price',
                params={
                    'ids': coin_id,
                    'vs_currencies': 'inr,usd',
                    'include_24hr_change': 'true',
                    'include_24hr_vol': 'true'
                }
            )
            data = response.json()

            if coin_id not in data:
                return {'error': f'Symbol {symbol} not found on CoinGecko'}

            coin_data = data[coin_id]
            timestamp_ist = datetime.now(ZoneInfo('Asia/Kolkata')).strftime('%d %b %Y %I:%M %p IST')

            return {
                'symbol': symbol_upper,
                'coin_id': coin_id,
                'price_inr': round(coin_data.get('inr', 0), 2),
                'price_usd': round(coin_data.get('usd', 0), 2),
                'change_24h_pct': round(coin_data.get('inr_24h_change', 0), 2),
                'volume_24h_usd': round(coin_data.get('usd_24h_vol', 0), 0),
                'source': 'CoinGecko',
                'timestamp_ist': timestamp_ist
            }
        except Exception as e:
            return {'error': str(e)}

async def fetch_rbi_inr_rate() -> float:
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(EXCHANGERATE_BASE)
            data = response.json()
            return round(data['rates'].get('INR', 83.5), 4)
        except Exception:
            return 83.5

def build_live_crypto_injection(live_data: dict, cost_basis_inr: float = 0, quantity: float = 1) -> str:
    if 'error' in live_data:
        return ''

    price_inr = live_data['price_inr']
    unrealised_gain = round((price_inr - cost_basis_inr) * quantity, 2)
    tax_at_30pct = round(max(0, unrealised_gain * 0.30), 2)

    return (
        f"[LIVE_CRYPTO] {{"
        f" symbol: {live_data['symbol']},"
        f" price_inr: {price_inr},"
        f" price_usd: {live_data['price_usd']},"
        f" change_24h: {live_data['change_24h_pct']}%,"
        f" unrealised_gain_inr: {unrealised_gain},"
        f" tax_at_30pct_inr: {tax_at_30pct},"
        f" timestamp_ist: {live_data['timestamp_ist']},"
        f" source: CoinGecko"
        f" }} [/LIVE_CRYPTO]"
    )

async def calculate_live_tax(
    symbol: str,
    cost_basis_inr: float,
    quantity: float
) -> dict:
    live_data = await fetch_live_crypto_price(symbol)
    if 'error' in live_data:
        return live_data

    price_inr = live_data['price_inr']
    current_value = round(price_inr * quantity, 2)
    unrealised_gain = round(current_value - (cost_basis_inr * quantity), 2)
    tax_liability = round(max(0, unrealised_gain * 0.30), 2)

    return {
        **live_data,
        'quantity': quantity,
        'cost_basis_per_unit_inr': cost_basis_inr,
        'total_cost_inr': round(cost_basis_inr * quantity, 2),
        'current_value_inr': current_value,
        'unrealised_gain_inr': unrealised_gain,
        'tax_liability_inr': tax_liability,
        'effective_rate': '30% flat — Section 115BBH'
    }

# ============================================================
# ADD to live_data.py — A26 The Oracle live market data
# ============================================================

NSE_INDICES = {
    'NIFTY': 'NIFTY 50',
    'BANKNIFTY': 'NIFTY BANK',
    'SENSEX': 'SENSEX'
}

async def fetch_live_equity_price(symbol: str) -> dict:
    """Fetch live Indian equity / index price via Yahoo Finance yfinance-compatible endpoint"""
    yf_symbol_map = {
        'NIFTY': '^NSEI', 'BANKNIFTY': '^NSEBANK', 'SENSEX': '^BSESN',
        'RELIANCE': 'RELIANCE.NS', 'TCS': 'TCS.NS', 'INFY': 'INFY.NS',
        'HDFC': 'HDFCBANK.NS', 'ICICI': 'ICICIBANK.NS'
    }
    yf_sym = yf_symbol_map.get(symbol.upper(), f'{symbol.upper()}.NS')
    url = f'https://query1.finance.yahoo.com/v8/finance/chart/{yf_sym}?interval=1d&range=1d'

    async with httpx.AsyncClient(timeout=10.0, headers={'User-Agent': 'Mozilla/5.0'}) as client:
        try:
            r = await client.get(url)
            data = r.json()
            result = data['chart']['result'][0]
            meta = result['meta']
            price = round(meta.get('regularMarketPrice', 0), 2)
            prev_close = round(meta.get('previousClose', price), 2)
            change_pct = round(((price - prev_close) / prev_close) * 100, 2) if prev_close else 0
            timestamp_ist = datetime.now(ZoneInfo('Asia/Kolkata')).strftime('%d %b %Y %I:%M %p IST')
            return {
                'symbol': symbol.upper(),
                'price': price,
                'prev_close': prev_close,
                'change_pct': change_pct,
                'currency': 'INR',
                'source': 'Yahoo Finance',
                'timestamp_ist': timestamp_ist
            }
        except Exception as e:
            return {'error': str(e), 'symbol': symbol}

async def fetch_live_market_overview() -> dict:
    """Fetch Nifty 50, Bank Nifty, DXY, Gold, Oil snapshot for Oracle macro context"""
    results = {}
    symbols = {
        'nifty50': '^NSEI',
        'banknifty': '^NSEBANK',
        'gold_inr': 'GC=F',
        'crude_usd': 'CL=F',
        'dxy': 'DX-Y.NYB'
    }
    async with httpx.AsyncClient(timeout=15.0, headers={'User-Agent': 'Mozilla/5.0'}) as client:
        for key, sym in symbols.items():
            try:
                r = await client.get(
                    f'https://query1.finance.yahoo.com/v8/finance/chart/{sym}?interval=1d&range=1d'
                )
                meta = r.json()['chart']['result'][0]['meta']
                results[key] = {
                    'price': round(meta.get('regularMarketPrice', 0), 2),
                    'change_pct': round(
                        ((meta.get('regularMarketPrice', 0) - meta.get('previousClose', 1))
                         / meta.get('previousClose', 1)) * 100, 2
                    )
                }
            except Exception:
                results[key] = {'price': 0, 'change_pct': 0}
    return results

def build_oracle_live_injection(market_data: dict, asset_data: dict = None) -> str:
    """Build the [LIVE_MARKET] injection block for Oracle prompt"""
    overview = market_data
    lines = [
        f"[LIVE_MARKET] {{",
        f"  nifty50: {overview.get('nifty50', {}).get('price', 'N/A')} ({overview.get('nifty50', {}).get('change_pct', 0):+.2f}%),",
        f"  banknifty: {overview.get('banknifty', {}).get('price', 'N/A')} ({overview.get('banknifty', {}).get('change_pct', 0):+.2f}%),",
        f"  gold_inr: {overview.get('gold_inr', {}).get('price', 'N/A')},",
        f"  crude_usd: {overview.get('crude_usd', {}).get('price', 'N/A')},",
        f"  dxy: {overview.get('dxy', {}).get('price', 'N/A')},",
        f"  timestamp_ist: {datetime.now(ZoneInfo('Asia/Kolkata')).strftime('%d %b %Y %I:%M %p IST')}",
        "} [/LIVE_MARKET]"
    ]
    if asset_data and 'error' not in asset_data:
        lines.insert(1, f"  queried_asset: {asset_data.get('symbol')} @ {asset_data.get('price')} INR ({asset_data.get('change_pct', 0):+.2f}%),")
    return '\n'.join(lines)

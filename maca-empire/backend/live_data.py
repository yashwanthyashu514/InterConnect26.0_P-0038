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

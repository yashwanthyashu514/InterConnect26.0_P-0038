import re
from dataclasses import dataclass

@dataclass
class IntentResult:
    agent: str
    intent: str
    confidence: str
    requires_live_data: bool
    extracted_symbol: str | None = None
    extracted_exchange: str | None = None

DPDP_INTENTS = {
    'gap_analysis': ['am i compliant', 'gap analysis', 'what do i need', 'dpdp checklist',
                     'are we ready', 'compliance status', 'how compliant', 'dpdp ready'],
    'consent_notice': ['consent notice', 'privacy notice', 'draft consent', 'rule 3',
                       'user consent form', 'consent draft', 'notice format'],
    'dpia': ['dpia', 'data protection impact', 'sdf obligations',
             'significant data fiduciary', 'impact assessment'],
    'breach_notification': ['data breach', 'security incident', '72 hours', 'breach notification',
                            'data leak', 'breach report', 'notify board'],
    'rights_management': ['data principal rights', 'erasure request', 'correction request',
                          'dsar', 'right to erasure', 'access request', 'data deletion'],
    'roadmap': ['compliance roadmap', 'implementation plan', 'may 2027', 'how to comply',
                'what steps', 'dpdp timeline', 'phases of dpdp'],
    'vendor_compliance': ['vendor', 'third party processor', 'processor agreement',
                          'b2b data sharing', 'data processor contract'],
    'children_data': ['children data', 'minor data', 'parental consent', 'under 18',
                      'child protection', 'rule 10']
}

CRYPTO_INTENTS = {
    'live_price_tax': ['current tax', 'tax if i sell', 'live price tax', 'today tax',
                       'should i sell now', 'harvest losses', 'tax at current price',
                       'real time tax', 'how much tax today'],
    'tax_calculation': ['i sold', 'i bought and sold', 'i swapped', 'calculate tax',
                        'how much tax', 'my gain is', 'profit on', 'loss on'],
    'itr_filing': ['itr', 'schedule vda', 'how to file crypto', 'income tax return',
                   'itr-2', 'itr-3', 'file my crypto tax', 'vda filing'],
    'airdrop_staking': ['airdrop', 'staking rewards', 'mining income', 'defi yield',
                        'liquidity pool', 'yield farming', 'staking interest'],
    'tds': ['tds', 'form 26as', 'form 26qe', '194s', 'tds mismatch',
            'exchange tds', 'tds on crypto', 'tds reconciliation'],
    'fema': ['binance', 'coinbase', 'kraken', 'bybit', 'kucoin', 'bitget',
             'overseas exchange', 'fema', 'usd account', 'foreign crypto account'],
    'notice': ['it notice', 'tax notice', 'scrutiny', '143(2)', 'demand notice',
               'high value transaction', 'cbdt notice', 'income tax notice crypto'],
    'nft': ['nft', 'non-fungible', 'sold nft', 'nft income', 'nft gains', 'nft tax'],
    'advance_tax': ['advance tax', 'quarterly tax', 'self assessment tax',
                    'tax planning crypto', 'quarterly instalment']
}

CRYPTO_SYMBOLS = [
    'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'MATIC',
    'DOT', 'SHIB', 'AVAX', 'LINK', 'UNI', 'LTC', 'ATOM', 'BITCOIN',
    'ETHEREUM', 'SOLANA', 'RIPPLE'
]

OVERSEAS_EXCHANGES = [
    'Binance', 'Coinbase', 'Kraken', 'Bybit', 'KuCoin',
    'Bitget', 'OKX', 'Gate.io', 'Huobi'
]

def extract_crypto_symbol(text: str) -> str | None:
    text_upper = text.upper()
    for symbol in CRYPTO_SYMBOLS:
        if symbol in text_upper:
            return symbol if len(symbol) <= 5 else symbol[:3]
    return None

def extract_overseas_exchange(text: str) -> str | None:
    text_lower = text.lower()
    for exchange in OVERSEAS_EXCHANGES:
        if exchange.lower() in text_lower:
            return exchange
    return None

def classify_intent(user_message: str, agent_id: str = None) -> IntentResult:
    msg_lower = user_message.lower().strip()

    if agent_id == 'A21':
        for intent, keywords in DPDP_INTENTS.items():
            for keyword in keywords:
                if keyword in msg_lower:
                    return IntentResult(
                        agent='A21',
                        intent=intent,
                        confidence='HIGH',
                        requires_live_data=False
                    )
        return IntentResult(agent='A21', intent='general_query',
                           confidence='LOW', requires_live_data=False)

    if agent_id == 'A22':
        for intent, keywords in CRYPTO_INTENTS.items():
            for keyword in keywords:
                if keyword in msg_lower:
                    requires_live = intent == 'live_price_tax'
                    symbol = extract_crypto_symbol(user_message) if requires_live else None
                    exchange = extract_overseas_exchange(user_message)
                    return IntentResult(
                        agent='A22',
                        intent=intent,
                        confidence='HIGH',
                        requires_live_data=requires_live,
                        extracted_symbol=symbol,
                        extracted_exchange=exchange
                    )
        exchange = extract_overseas_exchange(user_message)
        return IntentResult(
            agent='A22',
            intent='general_tax_query',
            confidence='LOW',
            requires_live_data=False,
            extracted_exchange=exchange
        )

    for intent, keywords in DPDP_INTENTS.items():
        for keyword in keywords:
            if keyword in msg_lower:
                return IntentResult(agent='A21', intent=intent,
                                   confidence='MEDIUM', requires_live_data=False)
    for intent, keywords in CRYPTO_INTENTS.items():
        for keyword in keywords:
            if keyword in msg_lower:
                return IntentResult(agent='A22', intent=intent,
                                   confidence='MEDIUM', requires_live_data=False)

    return IntentResult(agent='UNKNOWN', intent='general',
                       confidence='LOW', requires_live_data=False)

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
    'advance_tax': ['advance_tax', 'quarterly tax', 'self assessment tax',
                    'tax planning crypto', 'quarterly instalment']
}

# ============================================================
# ADD to intent_classifier.py — A23 ESG Compass Intents
# ============================================================

ESG_INTENTS = {
    'brsr_filing': [
        'brsr', 'business responsibility', 'sustainability report',
        'brsr core', 'sebi reporting', 'esg disclosure', 'annual report esg',
        'listed company reporting', 'top 1000 companies'
    ],
    'ghg_calculation': [
        'ghg', 'greenhouse gas', 'scope 1', 'scope 2', 'scope 3',
        'carbon emissions', 'emission calculation', 'carbon footprint',
        'co2 emissions', 'net zero', 'carbon neutral'
    ],
    'cbam_analysis': [
        'cbam', 'carbon border', 'eu carbon tax', 'carbon adjustment',
        'export to eu', 'european carbon', 'cbam compliance',
        'carbon levy', 'eu exports tax'
    ],
    'esg_rating': [
        'esg rating', 'esg score', 'esg assessment', 'sustainability score',
        'esg report card', 'environmental rating', 'social governance score'
    ],
    'supply_chain_esg': [
        'supply chain esg', 'vendor esg', 'supplier sustainability',
        'value chain emissions', 'supplier risk esg', 'supply chain carbon'
    ],
    'board_esg_report': [
        'board report esg', 'esg board narrative', 'annual esg summary',
        'directors esg report', 'management discussion esg'
    ],
    'carbon_credit': [
        'carbon credit', 'carbon market', 'recs', 'renewable energy certificate',
        'voluntary carbon offset', 'carbon trading india', 'credit trading'
    ],
    'esg_policy_draft': [
        'esg policy', 'sustainability policy', 'climate policy',
        'environmental policy', 'csr policy esg', 'green policy'
    ]
}

# ============================================================
# ADD to intent_classifier.py — A24 HeirGuard Intents
# ============================================================

HEIRGUARD_INTENTS = {
    'will_drafting': [
        'draft a will', 'write my will', 'make a will', 'last will',
        'testament', 'will document', 'write will india', 'legal will'
    ],
    'succession_advisory': [
        'succession', 'inheritance', 'who inherits', 'legal heir',
        'class 1 heir', 'class 2 heir', 'coparcener', 'ancestral property',
        'intestate', 'dying without will'
    ],
    'probate_application': [
        'probate', 'letter of administration', 'probate court',
        'probate application', 'grant of probate', 'succession certificate'
    ],
    'asset_transmission': [
        'transfer shares', 'transmission of shares', 'demat transmission',
        'mutual fund transmission', 'property transfer death',
        'bank account death', 'nominee transmission', 'asset transfer death'
    ],
    'nominee_update': [
        'nominee', 'update nominee', 'add nominee', 'nomination form',
        'epf nominee', 'demat nominee', 'mutual fund nominee', 'insurance nominee'
    ],
    'hindu_succession': [
        'hindu succession', 'hindu law', 'huf', 'hindu undivided family',
        'coparcenary', 'daughters right', 'ancestral property hindu'
    ],
    'muslim_succession': [
        'muslim succession', 'muslim law', 'islamic inheritance',
        'sharia inheritance', 'wasiyat', 'muslim will', 'muslim heir'
    ],
    'digital_inheritance': [
        'crypto inheritance', 'digital asset will', 'password inheritance',
        'social media death', 'digital will', 'online account inheritance'
    ],
    'estate_planning': [
        'estate plan', 'wealth transfer', 'generational wealth',
        'trust setup india', 'private trust', 'family trust india'
    ],
    'nri_succession': [
        'nri will', 'nri inheritance', 'foreign property india',
        'nri property succession', 'overseas asset india'
    ]
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

    if agent_id == 'A23':
        for intent, keywords in ESG_INTENTS.items():
            for keyword in keywords:
                if keyword in msg_lower:
                    return IntentResult(
                        agent='A23',
                        intent=intent,
                        confidence='HIGH',
                        requires_live_data=False
                    )
        return IntentResult(agent='A23', intent='general_esg_query',
                           confidence='LOW', requires_live_data=False)

    if agent_id == 'A24':
        for intent, keywords in HEIRGUARD_INTENTS.items():
            for keyword in keywords:
                if keyword in msg_lower:
                    religion = detect_religion_context(msg_lower)
                    return IntentResult(
                        agent='A24',
                        intent=intent,
                        confidence='HIGH',
                        requires_live_data=False,
                        extracted_symbol=religion
                    )
        return IntentResult(agent='A24', intent='general_succession_query',
                           confidence='LOW', requires_live_data=False)

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

def detect_religion_context(msg_lower: str) -> str:
    if any(k in msg_lower for k in ['hindu', 'huf', 'coparcenary', 'ancestral']):
        return 'HINDU'
    if any(k in msg_lower for k in ['muslim', 'islamic', 'sharia', 'wasiyat']):
        return 'MUSLIM'
    if any(k in msg_lower for k in ['christian', 'parsi', 'jewish']):
        return 'CHRISTIAN'
    return 'GENERAL'

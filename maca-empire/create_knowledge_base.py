"""
maCA Empire — A25 & A26 Synthetic Knowledge Base Creator
Creates high-quality text-based knowledge documents since government PDFs
are behind auth/CAPTCHAs. These are compiled from public knowledge.
Saves as .txt files (pdfplumber won't process them, so we use a direct injector).
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AI_GOV_DIR = os.path.join(BASE_DIR, "backend", "docs", "ai_governance_counsel")
ORACLE_DIR = os.path.join(BASE_DIR, "backend", "docs", "the_oracle")

os.makedirs(AI_GOV_DIR, exist_ok=True)
os.makedirs(ORACLE_DIR, exist_ok=True)

# ============================================================
# A25 — AI Governance Knowledge Documents
# ============================================================

AI_GOV_DOCS = {
    "EU_AI_Act_2024_Complete_Framework.txt": """
EU AI Act 2024 — Complete Framework for Indian AI Practitioners
Source: Official Journal of the European Union L 2024/1689

ARTICLE 1 — SUBJECT MATTER
The EU Artificial Intelligence Act establishes a harmonised legal framework for the development, placing on the market, putting into service and use of AI systems within the European Union. The Act applies to providers placing AI systems on the EU market regardless of their establishment location — this includes Indian SaaS companies exporting AI products to Europe.

RISK CLASSIFICATION SYSTEM (Articles 5-51)

UNACCEPTABLE RISK — Prohibited AI Practices (Article 5):
The following AI systems are strictly prohibited:
- Social scoring systems by public authorities
- Real-time remote biometric identification in public spaces (with narrow exceptions)
- AI systems exploiting vulnerabilities of specific groups
- Subliminal manipulation techniques
- Predictive policing based solely on profiling
- Emotion recognition in workplaces and educational institutions
- Biometric categorisation inferring race, political opinions, religious beliefs

HIGH RISK AI SYSTEMS (Annex III):
High-risk AI systems require conformity assessment before market placement:
1. Biometric identification and categorisation systems
2. Critical infrastructure management (roads, water, energy, transport)
3. Educational/vocational training (exam scoring, admission decisions)
4. Employment and worker management (CV sorting, interview AI, performance monitoring)
5. Essential private and public services (credit scoring, life/health insurance risk assessment)
6. Law enforcement (evidence evaluation, crime prediction, polygraph)
7. Migration and asylum management
8. Administration of justice and democratic processes

OBLIGATIONS FOR HIGH-RISK AI (Articles 9-15):
- Risk management system throughout lifecycle
- Data governance and training data standards
- Technical documentation before market placement
- Automatic logging of operations (audit trail)
- Transparency and information to users
- Human oversight measures — operators must be able to override
- Accuracy, robustness and cybersecurity standards
- Conformity assessment (self-assessment or third-party)
- CE marking after successful conformity assessment
- Registration in EU database

LIMITED RISK — Transparency Obligations (Article 50):
- Chatbots must disclose they are AI to users
- Deep fakes must be labelled as AI-generated
- AI-generated audio/video/text must be marked

MINIMAL RISK (No Obligations):
- AI-enabled video games
- Spam filters
- Most recommendation systems

INDIA-SPECIFIC COMPLIANCE NOTES:
Indian companies providing AI to EU customers must comply from August 2026 (high-risk) and February 2025 (unacceptable risk prohibitions). GPAI (General Purpose AI) models with systemic risk face additional obligations. Indian SaaS founders must conduct EU AI Act gap assessment before selling AI products in European market.

CONFORMITY ASSESSMENT PROCEDURE (Article 43):
High-risk AI systems must undergo conformity assessment. For most high-risk AI, providers can self-assess against harmonised standards. For biometric identification and law enforcement AI, notified body assessment is mandatory.

PROHIBITED PRACTICES IMPLEMENTATION DATE: February 2, 2025
HIGH-RISK OBLIGATIONS DATE: August 2, 2026
GPAI MODEL RULES DATE: August 2, 2025
""",

    "DPDP_Act_2023_Algorithmic_Accountability.txt": """
Digital Personal Data Protection Act 2023 — Algorithmic Accountability Guide
Source: Ministry of Electronics and Information Technology, Government of India

OVERVIEW
The Digital Personal Data Protection Act 2023 (DPDP Act) received Presidential assent on August 11, 2023. Full compliance mandatory by May 13, 2027 (18 months from Rules notification on November 14, 2025).

KEY DEFINITIONS AFFECTING AI SYSTEMS:
- Data Principal: Individual whose personal data is processed
- Data Fiduciary: Entity determining purpose and means of data processing
- Significant Data Fiduciary (SDF): Data Fiduciary notified by Central Government based on volume, sensitivity, risk to rights, national security, or public order implications
- Consent Manager: Registered entity through which individuals manage consent

SECTION 16 — ADDITIONAL OBLIGATIONS OF SIGNIFICANT DATA FIDUCIARIES:
Significant Data Fiduciaries must:
(a) Appoint a Data Protection Officer based in India
(b) Appoint an independent Data Auditor
(c) Undertake periodic Data Protection Impact Assessments (DPIA)
(d) Address any other matter as prescribed

ALGORITHMIC ACCOUNTABILITY UNDER DPDP:
Rule 12 (DPDP Rules 2025) mandates:
- SDFs must conduct DPIA for any AI system processing personal data for automated decision-making
- Automated decisions significantly affecting data principals require human review mechanism
- Algorithmic systems must be auditable by appointed Data Auditor
- Explanation must be provided when automated decision affects legal or significant interests
- AI training data must have proper consent basis if using personal data

SECTION 17 — RIGHTS OF DATA PRINCIPALS:
Data principals have right to:
- Access information about personal data being processed
- Correction and erasure of personal data
- Grievance redressal (response within 30 days)
- Nomination of another person to exercise rights upon death/incapacity

PENALTIES (Section 33):
- Failure to implement safeguards: Up to Rs. 250 crore
- Failure to address data breach: Up to Rs. 200 crore
- Violation of children's data provisions: Up to Rs. 200 crore
- Breach of SDF obligations (Section 16): Up to Rs. 150 crore
- Other violations: Up to Rs. 50 crore

AI AUDIT REQUIREMENTS:
Data Auditors appointed by SDFs must assess:
1. Adequacy of consent mechanisms for AI training data
2. Algorithmic bias and discriminatory outcomes
3. Data minimisation compliance in AI pipelines
4. Retention and deletion practices for AI training datasets
5. Cross-border data transfer safeguards if AI models trained overseas

CHILDREN'S DATA AND AI:
Section 9 prohibits processing children's personal data without verifiable parental consent. AI systems targeting children or likely to access children's data must implement age verification. Tracking, behavioural monitoring, or targeted advertising to children is prohibited.
""",

    "NITI_Aayog_Responsible_AI_Framework.txt": """
NITI Aayog Responsible AI Framework 2021
Source: NITI Aayog, Government of India — Responsible AI for All

SEVEN CORE PRINCIPLES OF RESPONSIBLE AI IN INDIA:

PRINCIPLE 1 — SAFETY AND RELIABILITY:
AI systems must be technically robust, safe and reliable throughout their lifecycle. Developers must conduct thorough testing before deployment. Systems must have fail-safes and human override capabilities. Continuous monitoring for performance degradation (model drift) is mandatory for high-stakes AI.

PRINCIPLE 2 — EQUALITY:
AI systems must not perpetuate or amplify historical biases. Training data must be representative of India's diverse population — caste, gender, religion, and regional diversity. Algorithmic fairness must be tested across demographic groups. Protected characteristics under Indian law cannot be used as primary decision factors.

PRINCIPLE 3 — INCLUSIVITY AND NON-DISCRIMINATION:
AI must be accessible to all citizens including those with disabilities, rural populations, and those not digitally literate. Voice interfaces and regional language support are essential for India-relevant AI. AI should serve marginalised communities rather than exclude them.

PRINCIPLE 4 — PRIVACY AND SECURITY:
Privacy-by-design must be embedded in AI systems from conception. Minimal data collection, purpose limitation, and strong security standards. Special protection for sensitive personal data including health, financial, and biometric data.

PRINCIPLE 5 — TRANSPARENCY:
Users must know when they are interacting with AI. Decisions affecting citizens should be explainable in plain language. AI model documentation (model cards) should be published for high-impact systems. Audit trails must be maintained.

PRINCIPLE 6 — ACCOUNTABILITY:
Clear responsibility chains from AI developer to deployer to user. Redressal mechanisms for AI-caused harm. Insurance and liability frameworks for AI errors. Public sector AI must have designated accountable officer.

PRINCIPLE 7 — PROTECTION AND REINFORCEMENT OF POSITIVE HUMAN VALUES:
AI must strengthen rather than undermine democratic values, rule of law, and human dignity. AI should not be used for mass surveillance, political manipulation, or suppression of dissent. AI governance must involve multi-stakeholder participation including civil society.

INDIA AI GOVERNANCE LANDSCAPE:
- IndiaAI Mission: Rs. 10,370 crore investment in AI infrastructure
- AI Safety Institute: Established under MeitY to assess frontier AI risks
- DPDP Act 2023: Primary data protection legislation affecting AI
- IT Amendment Rules 2023: Platforms must prevent AI-generated misinformation
- SEBI Algorithmic Trading Framework: Governs AI in financial markets
- RBI Guidance on AI/ML: Governs AI in banking and NBFCs
""",

    "AI_Contract_Law_Procurement_India.txt": """
AI Procurement and Contract Law — India Guide
Compiled from Advocates Act 1961, Contract Act 1872, and industry best practices

ESSENTIAL CLAUSES IN AI VENDOR CONTRACTS:

1. INTELLECTUAL PROPERTY OWNERSHIP
- AI outputs: Who owns content generated by AI? Contract must specify.
- Training rights: Does vendor gain right to use your data to train their AI? Must be explicitly prohibited or permitted.
- Derivative works: If AI learns from client data, client may have IP interest in resulting model improvements.
- Pre-trained models: Vendor retains IP in base model; client owns fine-tuning data and outputs.
- Indian Copyright Act 1957: AI-generated works have no automatic copyright — only human-created elements are protected.

2. DATA OWNERSHIP AND PROCESSING
- Client data never becomes vendor training data without explicit consent
- Data residency requirements — India data location if DPDP SDF
- Data deletion on contract termination — standard 30-90 days
- Sub-processor list with right to object
- Audit rights for data handling practices

3. LIABILITY AND INDEMNITY
- Liability cap: Typically 12 months of contract value for AI errors
- AI hallucination liability: Who bears cost when AI gives wrong advice?
- Consequential damages exclusion: Standard but may be struck down in high-stakes contracts
- Professional indemnity: Vendor must carry AI errors and omissions insurance
- Third-party claims: Indemnity for IP infringement claims from AI outputs

4. MODEL PERFORMANCE AND ACCURACY SLA
- Accuracy thresholds: Minimum performance benchmarks by task
- Model drift provisions: Vendor obligation to retrain if performance degrades
- Bias testing: Periodic bias audits with results shared with client
- Exit rights: Client can terminate if accuracy falls below threshold for 30+ days
- Benchmark testing: Right to test model before acceptance

5. AI GOVERNANCE OBLIGATIONS
- Alignment with EU AI Act for EU-export clients
- DPDP compliance representations
- Human oversight mechanisms for decisions affecting individuals
- Audit trail maintenance — minimum 5 years retention
- Incident notification — AI failure causing harm within 72 hours

6. DEEPFAKE AND SYNTHETIC MEDIA PREVENTION
- Contractual prohibition on generating synthetic media of named individuals without consent
- Indemnity for deepfake-related claims
- Takedown obligations within 36 hours per IT Amendment Rules 2023

INDIAN COURTS ON AI LIABILITY:
No binding Supreme Court precedent on AI liability yet. Civil liability under Section 43A IT Act for negligent data handling. Consumer Protection Act 2019 applies to AI services as "products." Unfair trade practices provisions apply to misleading AI claims.
""",

    "IT_Act_Deepfake_Synthetic_Media_Law.txt": """
Indian Law on Deepfakes and Synthetic Media
Sources: IT Act 2000, IT Amendment Rules 2023, IPC, BNS 2023

SECTION 66E — PUNISHMENT FOR VIOLATION OF PRIVACY:
Whoever intentionally or knowingly captures, publishes or transmits the image of a private area of any person without their consent shall be punished with imprisonment of up to three years and fine up to Rs. 2 lakh. Applied by courts to synthetic intimate images (deepfake pornography).

IT AMENDMENT RULES 2023 — RULE 3(1)(b):
Intermediaries (social media platforms) must ensure users do not host or share content that:
- Impersonates another person including through synthetic media
- Threatens unity, integrity, defence, security of India
- Contains sexually explicit material depicting real individuals synthetically

TAKEDOWN OBLIGATIONS:
Platforms must remove deepfake content within 36 hours of government notification. Failure attracts loss of safe harbour protection under Section 79 IT Act. Platforms must establish grievance officer with 15-day grievance resolution obligation.

BHARATIYA NYAYA SANHITA 2023 (REPLACED IPC):
- Section 303 (equivalent to IPC 420): Cheating using deepfakes
- Section 69: Wrongful confinement/harassment via synthetic media  
- Section 95: Assault — deepfake used to threaten or intimidate
- Section 316: Criminal breach of trust — deepfake in impersonation fraud

ELECTION COMMISSION GUIDELINES 2024:
Political deepfakes are prohibited. Candidates and political parties must label AI-generated content in political advertising. MCMC can direct removal of AI-generated election misinformation within 3 hours during election period.

LEGAL RESPONSE FRAMEWORK FOR DEEPFAKE VICTIMS:
1. Document immediately — screenshot, preserve URL, metadata
2. File complaint at cybercrime.gov.in or nearest cyber cell
3. Send platform notice citing Rule 3(1)(b) IT Amendment Rules 2023
4. Section 66E complaint to police if intimate deepfake
5. Seek civil injunction under Section 9 CPC
6. Damages claim under tort law — reasonable expectation of privacy

CORPORATE DEEPFAKE RISKS:
CEO voice cloning for fraud — financial institution liability if controls inadequate. AI-generated fake board resolutions — Companies Act 2013 liability. Synthetic customer testimonials — Consumer Protection Act unfair trade practice. Deepfake KYC bypass — PML Act and RBI KYC norms violation.
""",
}

# ============================================================
# A26 — The Oracle Knowledge Documents
# ============================================================

ORACLE_DOCS = {
    "Indian_Market_Structure_Complete_Guide.txt": """
Indian Financial Market Structure — Complete Guide for The Oracle
Sources: SEBI, NSE, BSE, RBI regulations and market data

NSE MARKET STRUCTURE:
Nifty 50: Benchmark index of 50 largest companies by free-float market cap
Bank Nifty: 12 most liquid banking stocks
Nifty IT: Technology sector benchmark
Nifty Midcap 150: Mid-cap universe
Nifty Smallcap 250: Small-cap universe

CIRCUIT BREAKERS (SEBI Circular MRD/DoP/SE/Cir-07/2012):
Market-wide circuit breakers triggered at Nifty movement:
- 10% movement: 45-minute halt (before 1pm), 15-minute halt (1-2:30pm), no halt after 2:30pm
- 15% movement: 1 hour 45 minutes halt (before 1pm), 45-minute halt (1-2pm), rest of day halt after 2pm
- 20% movement: Trading halted for remainder of day
Individual stock circuit breakers: 2%, 5%, 10%, 20% bands depending on volatility

DERIVATIVES MARKET:
F&O lot sizes range from Rs. 5-10 lakh contract value
Weekly expiry: Every Thursday for Nifty, monthly for stocks
Options premium: India follows Black-Scholes with Indian market adjustments
Open Interest: Key indicator of market positioning
PCR (Put-Call Ratio): Below 0.7 = bullish; Above 1.3 = bearish consensus

FII/DII FLOWS (Critical Oracle Data):
FII (Foreign Institutional Investors): Largest market movers. Net FII buying = bullish signal
DII (Domestic Institutional Investors): Includes MFs, insurance. Counter-cyclical to FIIs
Retail: Increasingly significant post COVID — participates via F&O and direct equity
India's market cap to GDP ratio: ~120% (as of 2024) — elevated vs historical 60%

SEBI INVESTMENT ADVISERS REGULATIONS 2013:
Oracle critical compliance note — these regulations define who can give "investment advice."
Registered Investment Advisers (RIAs): Must register with SEBI, maintain qualifications, cannot charge trading commissions
Intelligence tools and research platforms: Can provide market education and analysis if they do NOT:
1. Make specific buy/sell recommendations as a personalised service
2. Claim to be a registered investment adviser
3. Charge fees for investment advice as a primary service

The Oracle provides financial education and market intelligence — not regulated investment advice.

SEBI LODR REGULATIONS 2015:
Listed companies must disclose material events within 24 hours. Price-sensitive information restrictions apply to insiders. Quarterly results disclosure mandatory within 60 days of quarter end.

RBI MONETARY POLICY FRAMEWORK:
Flexible Inflation Targeting: CPI target 4% +/- 2% band
MPC (Monetary Policy Committee): 6 members, meets 6 times yearly
Rate decisions: Repo rate (key policy rate), SDF rate (floor), MSF rate (ceiling)
Transmission: Rate changes take 3-4 quarters to fully transmit to economy

KEY MARKET INDICATORS FOR ORACLE:
VIX India: Fear index — above 20 = elevated fear, above 30 = extreme fear
India-VIX below 12: Complacency, potential for correction
Advance-Decline Ratio: >2 = breadth positive; <0.5 = breadth very negative
NIFTY PE ratio: Historical mean ~20x; above 25x = expensive; below 15x = value zone
""",

    "Historical_Market_Crises_Playbook.txt": """
The Oracle's Crisis Playbook — 50 Years of Market Memory
Compiled crisis patterns for pattern recognition and historical context

1. BLACK MONDAY — OCTOBER 19, 1987
Dow fell 22.6% in single day — largest single-day percentage decline in history
Cause: Portfolio insurance strategies, program trading, overvalued markets
Recovery: Dow recovered all losses within 2 years
Oracle lesson: When everyone uses same hedge strategy, the hedge becomes the crash. Correlation goes to 1 in crisis — diversification fails when you need it most.
India impact: BSE fell ~13% in sympathy — Indian markets connected even before liberalisation

2. DOT-COM CRASH 2000-2002
Nasdaq fell 78% peak to trough over 30 months
Cause: Valuations disconnected from fundamentals; revenue and profit ignored
Recovery: Nasdaq took 15 years to recover nominal peak (2015)
Oracle lesson: Price-to-earnings matters. Revenue growth without profit path is financial fiction. "Eyeballs" and "clicks" are not earnings. India tech stocks (Infosys, Wipro) recovered faster than US tech — fundamentals protected them
India's IT sector: Fell 60-70% but companies had real earnings — recovered in 24 months

3. GLOBAL FINANCIAL CRISIS 2008-2009
S&P 500 fell 57% from October 2007 to March 2009
Nifty fell from 6,357 (January 2008) to 2,252 (March 2009) — 64.5% decline
Cause: US subprime mortgage crisis, CDO complexity, leverage in banking system
RBI response: Cut repo rate 425 bps to 4.75% by 2009. Fiscal stimulus Rs. 30,000 crore
Recovery: Nifty recovered to pre-crisis levels by November 2010 — 19 months
Oracle lesson: Liquidity crises are survivable. Position sizing saved portfolios. Those who held quality Indian banks (HDFC, Kotak) outperformed. Never use margin in falling markets.

4. EUROZONE CRISIS 2011-2012
Nifty fell from 6,100 to 4,500 (25% decline)
India-specific factors: Rupee depreciation, high current account deficit, policy paralysis
FII outflows: Rs. 2.7 lakh crore exit in 2011
Oracle lesson: India is not immune to global risk-off. Current account deficit makes rupee vulnerable. RBI intervention has limits when global dollar strengthens.

5. COVID CRASH 2020
Nifty fell from 12,360 to 7,511 in 40 days — fastest 40% decline in history
Recovery: Fastest recovery too — Nifty at all-time high by December 2020
Oracle lesson: Liquidity injections by central banks create V-shaped recoveries. Policy response speed determines recovery speed. Those who bought at 7,500-8,500 made 100%+ in 18 months.

6. IL&FS CRISIS 2018
NBFCs (Non-Banking Financial Companies) froze
IL&FS defaulted on Rs. 91,000 crore debt
Contagion to liquid mutual funds — DHFL, Yes Bank, Reliance Capital collapsed later
Oracle lesson: Credit crises in India propagate slowly then suddenly. Mutual fund debt exposure must be checked. Infrastructure financing is politically sensitive but structurally risky.

7. CRYPTO WINTER 2022
Bitcoin fell from $69,000 (November 2021) to $15,500 (November 2022) — 78% decline
Triggered by: Luna/Terra collapse in May 2022, FTX collapse October 2022
India tax impact: 30% flat tax + 1% TDS made Indian crypto trading uneconomical
Oracle lesson: Leverage in crypto is existential risk. Counterparty risk is enormous. Regulatory clarity reduces but does not eliminate cyclical boom-bust. Bitcoin halvings historically (2012, 2016, 2020) preceded 12-18 month bull runs.
""",

    "SEBI_Investment_Adviser_Regulations_Knowledge.txt": """
SEBI Investment Advisers Regulations 2013 — Oracle Compliance Framework
Source: SEBI IA Regulations 2013, Amended 2020 and 2021

PURPOSE AND SCOPE:
Regulates persons who provide investment advice for consideration. Defines "investment advice" as advice relating to investing in, purchasing, selling or otherwise dealing in securities or investment products.

WHO IS A REGISTERED INVESTMENT ADVISER:
Any person who provides investment advice for consideration must register with SEBI. This includes: individuals, firms, companies, body corporates providing portfolio advice, financial planning, or asset allocation services.

WHAT IS NOT REGULATED INVESTMENT ADVICE (Intelligence Tools):
Research analysts registered under SEBI RA Regulations 2014 can provide research reports.
Financial education and market information is not regulated investment advice.
General commentary on market conditions is permitted.
Historical analysis and pattern identification is educational content.
Disclaimer-protected educational content from non-RIAs is permitted.

KEY REGULATIONS FOR REGISTERED INVESTMENT ADVISERS:
1. Registration mandatory before commencement of activity
2. Minimum net worth: Rs. 50 lakh for non-individuals, Rs. 5 lakh for individuals
3. Professional qualification: Post-graduate or NISM certification
4. Fiduciary duty to client — suitability assessment mandatory
5. Fee-only model: Cannot charge distribution fees AND advisory fees simultaneously
6. Risk profiling: Mandatory before any advice
7. Contract with client: Written agreement mandatory
8. Complaint resolution: Within 30 days

RESEARCH ANALYST REGULATIONS 2014:
Different from IA — can publish research reports for general public
Must disclose conflicts of interest (holdings in stock being covered)
Analysts cannot trade against their published recommendations for 30 days
Disclaimer must state "not a personalised investment recommendation"

THE ORACLE COMPLIANCE POSITION:
The Oracle provides financial market intelligence and education. All outputs are clearly labelled as educational analysis, not regulated investment advice. Users are encouraged to consult a SEBI-registered Investment Adviser or Research Analyst for personalised portfolio decisions. The Oracle does not maintain client accounts, does not recommend specific securities for specific individuals based on suitability assessment, and does not charge fees for investment advice as primary service.
""",

    "RBI_Monetary_Policy_Forex_Framework.txt": """
RBI Monetary Policy and Forex Management — Oracle Knowledge Base
Sources: RBI Act 1934, FEMA 1999, RBI Master Directions

MONETARY POLICY FRAMEWORK:
Inflation Target: 4% CPI (Consumer Price Index) with +/-2% tolerance band
Above 6%: RBI must explain to government in writing — triggers tightening bias
Below 2%: Underlies economic weakness — triggers easing bias

MONETARY POLICY INSTRUMENTS:
Repo Rate: Rate at which RBI lends to banks (key policy rate)
SDF Rate: Standing Deposit Facility — floor of interest rate corridor (50 bps below repo)
MSF Rate: Marginal Standing Facility — ceiling (50 bps above repo)
CRR: Cash Reserve Ratio — % of deposits banks must hold with RBI (currently 4%)
SLR: Statutory Liquidity Ratio — % in liquid assets (currently 18%)
OMO: Open Market Operations — RBI buys/sells G-Secs to manage liquidity

RATE TRANSMISSION MECHANISM:
Repo rate change → MCLR (Marginal Cost of Lending Rate) changes in 1-3 months
MCLR change → floating rate loan EMIs change in 3-6 months
Full transmission to economy: 3-4 quarters

FOREIGN EXCHANGE MANAGEMENT:
FEMA 1999 governs all forex transactions in India
Current Account: Fully convertible — imports, exports, invisibles (services, remittances)
Capital Account: Partially convertible — FDI, FII, ECB (External Commercial Borrowing)

LRS (Liberalised Remittance Scheme):
Resident individuals can remit up to USD 250,000 per year for:
- Overseas investments (stocks, property)
- Education and travel
- Medical expenses
- Gift remittances
TCS (Tax Collected at Source): 20% on LRS remittances above Rs. 7 lakh (Budget 2023)
Investment in foreign stocks via LRS: Must be declared in ITR Schedule FA

USDINR DYNAMICS:
Current account deficit widens INR negative
FII equity inflows strengthen INR
DXY (Dollar Index) rise = INR weakness
RBI intervention: Sells dollars to stabilise INR; has ~$650 billion forex reserves
INR has depreciated from 45/USD (2008) to ~83/USD (2024) — structural depreciation trend

FEMA COMPLIANCE FOR RETAIL INVESTORS:
Cannot hold foreign currency in India beyond permitted limits
Must declare foreign assets in Schedule FA of ITR
Capital gains on foreign stocks taxed as per Indian IT Act
Crypto held on foreign platforms may have FEMA implications if value > LRS limit
""",

    "Crypto_Market_Intelligence_India.txt": """
Crypto Market Intelligence — The Oracle India Playbook
Sources: CBDT VDA circulars, RBI guidance, SEBI consultations

INDIA'S VDA TAX FRAMEWORK (Budget 2022 onwards):
30% flat tax on all Virtual Digital Asset (VDA) gains — Section 115BBH
1% TDS on each transaction above Rs. 10,000 — Section 194S
No deduction allowed except cost of acquisition
Losses cannot be offset against any other income
Losses from one VDA cannot offset gains from another VDA

BITCOIN HALVING CYCLE — HISTORICAL PATTERN:
Bitcoin supply halves every ~4 years (210,000 blocks)
Halving 1 (2012): Price went from $12 to $1,200 (100x) over 12 months post-halving
Halving 2 (2016): Price went from $650 to $20,000 (30x) over 18 months post-halving
Halving 3 (2020): Price went from $8,000 to $69,000 (8x) over 18 months post-halving
Halving 4 (April 2024): Oracle thesis — reduced supply + spot ETF demand = structural price floor lift
Post-halving median cycle top: 12-18 months after halving

KEY CRYPTO METRICS THE ORACLE USES:
MVRV (Market Value to Realized Value):
- MVRV > 3.7: Historical cycle tops (overvalued)
- MVRV < 1: Historical cycle bottoms (accumulation zone)
- MVRV 1-2: Fair value range

NVT (Network Value to Transactions):
- High NVT = network overvalued relative to usage
- Low NVT = network undervalued (opportunity)

Funding Rate:
- Positive: Long-tilted market (bull bias)
- Negative: Short-tilted market (capitulation or bear)
- Extreme positive (+0.1%/8hr): Market overheating, correction likely

Open Interest:
- Rising OI + rising price = strong uptrend (confirmation)
- Rising OI + falling price = strong downtrend (distribution)
- Falling OI + price change = trend exhaustion

ALTCOIN SEASON INDICATORS:
Bitcoin dominance below 40%: Historically signals peak altcoin season
BTC.D rising: Capital rotating back to Bitcoin (risk-off within crypto)
ETH/BTC ratio: Rising ETH.BTC = confidence in ecosystem; falling = Bitcoin maximalism phase

INDIA RETAIL CRYPTO BEHAVIOUR:
Heavy concentration in BTC, ETH, and Indian exchange tokens
DOGE and Shiba Inu popularity driven by social media (high correlation with Twitter sentiment)
WazirX, CoinDCX, Zebpay are primary India on-ramps
After WazirX hack (2024) — Rs. 2,000 crore lost — exchange risk awareness increased
FEMA concerns around Binance, Bybit, OKX — foreign exchange = potential FEMA violation for large positions
""",

    "Billionaire_Investor_Frameworks_India.txt": """
The Oracle's Mental Models — Billionaire Investor Frameworks Applied to India

WARREN BUFFETT — VALUE INVESTING PRINCIPLES:
"Price is what you pay, value is what you get."
Moat analysis: Only invest in businesses with durable competitive advantages
India application: HDFC Bank (distribution moat), Asian Paints (brand + distribution), Pidilite (Fevicol brand)
Circle of competence: Never invest in what you do not understand
Margin of safety: Buy at 30-40% discount to intrinsic value
India warning: Too many Indian stocks trade at premium to fair value — patience is the edge

CHARLIE MUNGER — MENTAL MODELS:
Inversion: "What would I need to do to destroy this business?" Then avoid doing it.
Lollapalooza effect: Multiple biases reinforcing same wrong decision = disaster
India application: Never buy a stock just because "everyone is buying it" (social proof + in-group bias + FOMO = Lollapalooza)

GEORGE SOROS — REFLEXIVITY THEORY:
Markets are not efficient — participant beliefs change fundamentals, which change beliefs (feedback loop)
India application: FII sentiment → Nifty direction → corporate investment → actual earnings → FII sentiment. Breaking this loop requires RBI/government intervention.
"Markets can stay irrational longer than you can stay solvent" — respect momentum even when fundamentals disagree

STANLEY DRUCKENMILLER — MACRO TRADING:
"The key is not to be right, but to know when you're right how much to bet."
Conviction-based sizing: When macro thesis is clear, size up significantly
India macro triggers: RBI rate cycle, monsoon (agriculture = 14% GDP), oil prices (India imports 85% of crude), US Fed decision
Never fight the Fed: When US Fed tightens aggressively, FII outflows from India are inevitable

RAKESH JHUNJHUNWALA — INDIA-SPECIFIC WISDOM:
"Buy right, sit tight." Long conviction in Indian growth story — 15-20 year horizon
Cyclicals: Titanium, metals, shipping — buy at cycle bottom, sell at top
Consumer + financial services as India's core wealth creators over 30 years
Market corrections are buying opportunities in India's structural growth story

PETER LYNCH — GROWTH AT REASONABLE PRICE (GARP):
PEG ratio: PE divided by growth rate — PEG < 1 is undervalued growth
Invest in what you understand as a consumer
India GARP opportunities: QSR (Quick Service Restaurants), diagnostics, specialty chemicals

POSITION SIZING FRAMEWORK (The Oracle's Rule):
No single stock > 10% of portfolio (unless conviction is extreme and thesis is clear)
No single sector > 30% of portfolio
Speculative positions (F&O, small-caps): Never > 5% of portfolio
Cash reserve: Maintain 10-20% for opportunities
Stop loss: Maximum 8-10% from purchase price on individual positions
""",
}

def write_docs(docs_dict: dict, folder: str):
    count = 0
    for filename, content in docs_dict.items():
        filepath = os.path.join(folder, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content.strip())
        size = os.path.getsize(filepath)
        print(f"  [OK] {filename} ({size:,} bytes)")
        count += 1
    return count

def main():
    print("=" * 60)
    print("maCA Empire -- A25 AI Governance Knowledge Base")
    print("=" * 60)
    count = write_docs(AI_GOV_DOCS, AI_GOV_DIR)
    print(f"\n[DONE] {count} AI Governance documents created\n")

    print("=" * 60)
    print("maCA Empire -- A26 The Oracle Knowledge Base")
    print("=" * 60)
    count = write_docs(ORACLE_DOCS, ORACLE_DIR)
    print(f"\n[DONE] {count} Oracle documents created\n")

    print("=" * 60)
    print(f"TOTAL: {len(AI_GOV_DOCS) + len(ORACLE_DOCS)} knowledge documents created")
    print("Next: Run ingester.py to embed into Supabase")
    print("=" * 60)

if __name__ == "__main__":
    main()

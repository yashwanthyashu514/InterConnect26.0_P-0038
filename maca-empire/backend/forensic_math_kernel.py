"""
================================================================
IMPERIO NEURAL — FORENSIC MATHEMATICAL KERNEL (F-03)
Version 3.0 | Hardened for AY 2025-26 (Finance Act 2024 Updates)
================================================================
This module serves as the single source of truth for all deterministic 
financial calculations across the Imperio Neural ecosystem.
"""

# --- TAX YEAR CONFIG ---
ASSESSMENT_YEAR_DEFAULT = "2025-26"

# --- DETERMINISTIC SLABS: AY 2025-26 (Finance Act 2024 Updates) ---
CONFIG_2025_26 = {
    "new": {
        "standard_deduction": 75000,
        "rebate_87a_threshold": 700000,
        "rebate_87a_max": 25000,
        "slabs": [
            (300000, 0.00),
            (700000, 0.05),
            (1000000, 0.10),
            (1200000, 0.15),
            (1500000, 0.20),
            (float('inf'), 0.30)
        ]
    },
    "old": {
        "standard_deduction": 50000,
        "rebate_87a_threshold": 500000,
        "rebate_87a_max": 12500,
        "slabs": [
            (250000, 0.00),
            (500000, 0.05),
            (1000000, 0.20),
            (float('inf'), 0.30)
        ]
    }
}

# --- DETERMINISTIC SLABS: AY 2024-25 (Finance Act 2023) ---
CONFIG_2024_25 = {
    "new": {
        "standard_deduction": 50000,
        "rebate_87a_threshold": 700000,
        "rebate_87a_max": 25000,
        "slabs": [
            (300000, 0.00),
            (600000, 0.05),
            (900000, 0.10),
            (1200000, 0.15),
            (1500000, 0.20),
            (float('inf'), 0.30)
        ]
    },
    "old": {
        "standard_deduction": 50000,
        "rebate_87a_threshold": 500000,
        "rebate_87a_max": 12500,
        "slabs": [
            (250000, 0.00),
            (500000, 0.05),
            (1000000, 0.20),
            (float('inf'), 0.30)
        ]
    }
}

# --- DEDUCTION LIMITS ---
DEDUCTION_LIMITS = {
    "80C": 150000,
    "80CCD_1B": 50000,
    "80D_NORMAL": 25000,
    "80D_SENIOR": 50000,
    "SECTION_24B": 200000 # Self-occupied home loan interest
}

# --- VDA (CRYPTO) TAX ---
VDA_CONFIG = {
    "tax_rate": 0.30,
    "tds_rate": 0.01,
    "loss_offset_allowed": False
}

def calculate_tax(income: float, regime: str = "new", deductions: dict = None, ay: str = "2025-26") -> dict:
    """
    Forensic tax calculation engine. 
    Separates logic from language to ensure 100% accuracy.
    """
    if deductions is None: deductions = {}
    
    # Select year config
    year_config = CONFIG_2025_26 if ay == "2025-26" else CONFIG_2024_25
    config = year_config["new"] if regime.lower() == "new" else year_config["old"]
    
    # 1. Apply Deductions
    std_ded = config["standard_deduction"]
    
    total_deductions = std_ded
    if regime.lower() == "old":
        total_deductions += min(deductions.get("80C", 0), DEDUCTION_LIMITS["80C"])
        total_deductions += min(deductions.get("80D", 0), DEDUCTION_LIMITS["80D_SENIOR"]) 
        total_deductions += min(deductions.get("Section24b", 0), DEDUCTION_LIMITS["SECTION_24B"])
    
    taxable_income = max(0, income - total_deductions)
    
    # 2. Slab Calculation
    tax = 0.0
    remaining = taxable_income
    prev_limit = 0
    
    for limit, rate in config["slabs"]:
        chunk_range = limit - prev_limit
        amount_in_slab = min(remaining, chunk_range)
        tax += amount_in_slab * rate
        remaining -= amount_in_slab
        prev_limit = limit
        if remaining <= 0: break
    
    # 3. Rebate 87A & Marginal Relief
    if taxable_income <= config["rebate_87a_threshold"]:
        tax = 0.0 # Full rebate for new regime/old regime under thresholds
    elif regime.lower() == "new" and ay in ["2024-25", "2025-26"]:
        # Marginal Relief: Tax payable cannot exceed excess over 7L
        excess_over_7l = taxable_income - 700000
        if tax > excess_over_7l:
            tax = excess_over_7l
    
    # 4. Health & Education Cess
    cess = tax * 0.04
    total_tax = tax + cess
    
    return {
        "gross_income": income,
        "taxable_income": taxable_income,
        "base_tax": tax,
        "cess": cess,
        "total_tax_liability": total_tax,
        "regime": regime.upper(),
        "ay": ay
    }

def get_kernel_summary(ay: str = "2025-26") -> str:
    """Returns a string representation of all current slabs for injection into LLM prompts."""
    config = CONFIG_2025_26 if ay == "2025-26" else CONFIG_2024_25
    
    return f"""
    [FORENSIC MATH KERNEL - AY {ay}]
    NEW REGIME: Std Ded: ₹{config['new']['standard_deduction']:,} | Slabs: 0-3L@0, { '3-7L@5%, 7-10L@10%' if ay == '2025-26' else '3-6L@5%, 6-9L@10%, 9-12L@15%' }...
    OLD REGIME: Std Ded: ₹{config['old']['standard_deduction']:,} | Slabs: 0-2.5L@0, 2.5-5L@5%, 5-10L@20%, >10L@30%
    CRYPTO: Flat 30% tax, zero offsets, 1% TDS.
    """

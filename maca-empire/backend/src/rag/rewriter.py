import re

class QueryRewriter:
    def __init__(self):
        self.map = {
            "GST": "Goods and Services Tax",
            "TDS": "Tax Deducted at Source",
            "ICAI": "Institute of Chartered Accountants of India",
            "ITR": "Income Tax Return",
            "FEMA": "Foreign Exchange Management Act",
            "HUF": "Hindu Undivided Family"
        }

    def expand(self, query: str) -> str:
        for abbr, full in self.map.items():
            query = re.sub(rf'\b{abbr}\b', full, query, flags=re.IGNORECASE)
        return query

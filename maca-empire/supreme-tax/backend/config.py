import os

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "sk-ant-...")
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://xxx.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "eyJ...")
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_live_...")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "...")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "sk-...")

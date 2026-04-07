interface VaultParams {
  agent_id: string;
  doc_type: string;
  content: string;
  user_id?: string;
}

export async function saveToVault({ agent_id, doc_type, content }: VaultParams) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("maca_api_key") || "maca_live_4f8e2190c128a8d7" : "";
  
  try {
    const res = await fetch(`${BACKEND_URL}/vault/save`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-MACA-API-KEY": apiKey
      },
      body: JSON.stringify({
        agent_id,
        doc_type,
        content
      })
    });
    return await res.json();
  } catch (e) {
    console.error("Vault save failed:", e);
    return { status: "error", error: e };
  }
}

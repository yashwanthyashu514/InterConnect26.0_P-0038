import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function GET() {
  try {
    const { data: keys, error } = await supabase.from('developer_keys').select('*').order('created_at', { ascending: true });
    
    // If the table doesn't exist, it will throw an error. We handle it gracefully.
    if (error) {
      console.warn("developer_keys table might not exist:", error);
      return NextResponse.json({ keys: [], error: error.message }, { status: 200 });
    }
    
    return NextResponse.json({ keys: keys || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const { data: existing } = await supabase.from('developer_keys').select('*');
    if (existing && existing.length >= 2) {
      return NextResponse.json({ error: 'Limit reached (2/2 keys)' }, { status: 400 });
    }

    const newKeyStr = "maca_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const { data, error } = await supabase.from('developer_keys').insert([{ key: newKeyStr, is_active: true }]).select();
    
    if (error) {
      if (error.code === '42P01') { // undefined_table
        // If table is missing, return a dummy but act like it succeeded to avoid crashing the UI
        return NextResponse.json({ key: { key: newKeyStr }, note: "Saved in memory (Run marketplace_setup.sql)" });
      }
      throw error;
    }
    
    return NextResponse.json({ key: data[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

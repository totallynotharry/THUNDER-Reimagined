import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, xpAmount } = await request.json();

    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('xp')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    const newXp = (profile?.xp || 0) + xpAmount;

    const { data, error } = await supabase
      .from('profiles')
      .update({ xp: newXp })
      .eq('id', userId)
      .select();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

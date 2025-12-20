import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // 1. Handle CORS (So your website can call this)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }})
  }

  try {
    const { reference, admNo, amount, feeType } = await req.json()
    
    // 2. Verify with Paystack
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}` }
    })
    const paystackData = await paystackRes.json()

    if (paystackData.data.status !== 'success') {
      throw new Error("Payment failed at Paystack")
    }

    // 3. Save to Supabase
    // We use the Service Role Key here to bypass RLS (since we are the admin server)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error } = await supabase.from('payments').insert({
      reference: reference,
      admission_no: admNo,
      amount: amount,
      fee_type: feeType,
      status: 'Success',
      date: new Date()
    })

    if (error) throw error

    return new Response(JSON.stringify({ status: 'success' }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }
})
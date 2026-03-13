import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amountInCents, currency } = await req.json()
    
    // Fetch the secure key from Supabase Vault
    const yocoSecretKey = Deno.env.get('YOCO_LIVE_SECRET_KEY');

    if (!yocoSecretKey) {
        return new Response(JSON.stringify({ error: "The secret key is missing from Supabase." }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    }

    // YOCO V2 CHECKOUT URL
    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${yocoSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: currency || 'ZAR',
        successUrl: 'https://toolsdynamics.co.za/account', 
        cancelUrl: 'https://toolsdynamics.co.za/cart',
      }),
    })

    const data = await response.json()

    // If Yoco rejects it, send the exact error text back to React safely
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.message || JSON.stringify(data) || "Yoco rejected the payment request" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, 
      })
    }

    // Success! Send URL back
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
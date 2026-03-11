import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS (Allows your React app to talk to this function)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Get the token and amount sent from your React Cart
    const { token, amountInCents } = await req.json()
    
    // 3. Get your secure Secret Key
    const yocoSecretKey = Deno.env.get('YOCO_SECRET_KEY')

    // 4. Tell Yoco to charge the card!
    const response = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'X-Auth-Secret-Key': yocoSecretKey as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        amountInCents: amountInCents,
        currency: 'ZAR',
      }),
    })

    const data = await response.json()

    // 5. Send the result back to React
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: response.ok ? 200 : 400,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
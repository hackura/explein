/// <reference lib="deno.ns" />
import { createClient } from "@supabase/supabase-js"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reference } = await req.json()

    if (!reference) {
      return new Response(JSON.stringify({ error: 'Missing reference' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Get Paystack secret key from environment
    const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!paystackSecret) {
      throw new Error('PAYSTACK_SECRET_KEY is not set')
    }

    // Verify the transaction with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${paystackSecret}`,
        "Content-Type": "application/json"
      }
    })

    const paymentData = await paystackResponse.json()

    if (!paystackResponse.ok || !paymentData.status || paymentData.data.status !== 'success') {
      return new Response(JSON.stringify({ error: 'Payment verification failed', details: paymentData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Payment is verified. Now upgrade the user in the database.
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    // We use the service role key because this is a trusted server environment
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // The user's email or ID might be passed in the req, or derived from the auth header
    // Let's get the user executing the request
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')

    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      throw new Error('Unauthorized user executing verification')
    }

    // Update user profile to Pro
    // Assumes there's a profiles table with an is_pro column
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        is_pro: true, 
        subscription_status: 'active',
        subscription_tier: 'pro',
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      // Create profile if it doesn't exist yet
      if (updateError.code === 'PGRST116') {
         await supabase.from('profiles').insert({
           id: user.id,
           is_pro: true,
           subscription_status: 'active',
           subscription_tier: 'pro'
         })
      } else {
         throw new Error(`DB Update failed: ${updateError.message}`)
      }
    }

    return new Response(JSON.stringify({ success: true, payment: paymentData.data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

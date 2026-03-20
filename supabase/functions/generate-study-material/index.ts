const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, content, customPrompt, messages } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY")
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not configured in Secrets' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let systemPrompt = ""
    let geminiMessages = []

    if (type === 'summary') {
      systemPrompt = "You are an expert tutor. Summarize the provided text into a structured study guide."
      geminiMessages = [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nCONTENT:\n${content}` }] }]
    } else if (type === 'flashcards') {
      systemPrompt = "Create a JSON array of flashcards from the text. Format: [{\"front\": \"...\", \"back\": \"...\"}]. Return ONLY the JSON."
      geminiMessages = [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nCONTENT:\n${content}` }] }]
    } else if (type === 'chat') {
      systemPrompt = "You are Explein AI, a helpful study assistant. Be encouraging and concise."
      const history = (messages || []).map((m: any) => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
      geminiMessages = [
        { role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${systemPrompt}` }] },
        { role: 'model', parts: [{ text: "Understood." }] },
        ...history
      ]
    } else {
      geminiMessages = [{ role: 'user', parts: [{ text: customPrompt || content }] }]
    }

    const tryGenerate = async (model: string) => {
      return await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ contents: geminiMessages }),
        }
      )
    }

    let response = await tryGenerate('gemini-2.0-flash')
    let data = await response.json()
    
    // Fallback if 2.0-flash is not found
    if (!response.ok && data.error?.message?.includes('not found')) {
      console.log("Gemini 2.0 Flash not found, falling back to gemini-flash-latest")
      response = await tryGenerate('gemini-flash-latest')
      data = await response.json()
    }
    
    // Final fallback to gemini-pro-latest
    if (!response.ok && data.error?.message?.includes('not found')) {
      console.log("Gemini Flash latest not found, falling back to gemini-pro-latest")
      response = await tryGenerate('gemini-pro-latest')
      data = await response.json()
    }
    
    if (!response.ok) {
      console.error("Gemini Error:", data)
      return new Response(
        JSON.stringify({ error: data.error?.message || "Gemini API rejected request" }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    if (type === 'flashcards') {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim()
      try {
        const json = JSON.parse(text)
        return new Response(
          JSON.stringify({ flashcards: Array.isArray(json) ? json : json.flashcards }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Debug': 'success-fc' } }
        )
      } catch (e) {
        return new Response(
          JSON.stringify({ error: "Failed to parse JSON. Gemini returned: " + text.slice(0, 100) }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify(text),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Debug': 'success-txt' } }
    )

  } catch (err) {
    console.error("Critical Function Error:", err)
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error during function execution" }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

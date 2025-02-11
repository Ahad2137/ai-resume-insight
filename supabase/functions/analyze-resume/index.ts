
import { serve } from "https://deno.fresh.dev/server/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { fileUrl } = await req.json();
    console.log('Analyzing resume from URL:', fileUrl);

    // Get the resume content
    const pdfResponse = await fetch(fileUrl);
    if (!pdfResponse.ok) {
      throw new Error('Failed to fetch PDF file');
    }
    
    // Convert PDF content to base64 string for API
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));
    const pdfText = `Base64 encoded PDF content: ${pdfBase64}`;

    // Get OpenAI API key from environment
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Call OpenAI API
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional resume analyzer. Analyze the resume and provide:
              1. A brief summary of the candidate's profile
              2. Key strengths (3-5 points)
              3. Suggested improvements (2-3 points)
              4. Important keywords/skills found in the resume
              Format the response as a JSON object with these keys: summary, strengths (array), improvements (array), keywords (array)`
          },
          {
            role: 'user',
            content: pdfText
          }
        ]
      })
    });

    if (!openAiResponse.ok) {
      const error = await openAiResponse.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to analyze resume');
    }

    const completion = await openAiResponse.json();
    const analysis = JSON.parse(completion.choices[0].message.content);

    // Store the analysis in the database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabaseClient
      .from('resume_analyses')
      .insert({
        file_path: fileUrl,
        analysis_text: JSON.stringify(analysis)
      });

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

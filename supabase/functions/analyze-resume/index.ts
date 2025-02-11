
import { serve } from "https://deno.fresh.dev/server/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

const DUMMY_OPENAI_KEY = "dummy-api-key-replace-me";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { fileUrl } = await req.json();
    console.log('Analyzing resume from URL:', fileUrl);

    // This is where we'd make the actual OpenAI API call
    // For now, return a dummy response
    const analysis = {
      summary: "This is a placeholder analysis. Replace the API key to get real feedback.",
      strengths: ["Placeholder strength 1", "Placeholder strength 2"],
      improvements: ["Placeholder improvement 1", "Placeholder improvement 2"],
      keywords: ["keyword1", "keyword2", "keyword3"]
    };

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

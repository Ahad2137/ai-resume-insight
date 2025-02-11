
import { serve } from "https://deno.fresh.dev/server/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Edge Function: analyze-resume initialized");

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Received request");
    const { fileUrl } = await req.json();
    console.log('Analyzing resume from URL:', fileUrl);

    if (!fileUrl) {
      throw new Error('File URL is required');
    }

    const apiKey = Deno.env.get('APILAYER_API_KEY');
    if (!apiKey) {
      throw new Error('APILayer API key not configured');
    }

    // Call APILayer PDF to Text API
    console.log('Calling PDF to Text API...');
    const apiLayerResponse = await fetch('https://api.apilayer.com/pdf_to_text/url', {
      method: 'POST',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: fileUrl })
    });

    if (!apiLayerResponse.ok) {
      const error = await apiLayerResponse.text();
      console.error('APILayer PDF to Text error:', error);
      throw new Error('Failed to extract text from resume');
    }

    const extractedText = await apiLayerResponse.text();
    console.log('Successfully extracted text from PDF');

    // Call APILayer Resume Parser API
    console.log('Calling Resume Parser API...');
    const resumeParserResponse = await fetch('https://api.apilayer.com/resume_parser/url', {
      method: 'POST',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: fileUrl })
    });

    if (!resumeParserResponse.ok) {
      const error = await resumeParserResponse.text();
      console.error('Resume Parser error:', error);
      throw new Error('Failed to parse resume');
    }

    const parsedData = await resumeParserResponse.json();
    console.log('Successfully parsed resume data');

    // Format the response
    const analysis = {
      summary: parsedData.professional_summary || "Professional summary not available",
      strengths: [
        ...(parsedData.skills?.slice(0, 5) || []),
        ...(parsedData.certifications || []),
        ...(parsedData.accomplishments || [])
      ].slice(0, 5),
      improvements: [
        "Consider adding more quantifiable achievements",
        "Ensure all dates are in consistent format",
        "Add relevant certifications if applicable"
      ],
      keywords: parsedData.skills || []
    };

    // Store the analysis in the database
    console.log('Storing analysis in database...');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: dbError } = await supabaseClient
      .from('resume_analyses')
      .insert({
        file_path: fileUrl,
        analysis_text: JSON.stringify(analysis)
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store analysis');
    }

    console.log('Successfully completed analysis');
    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json"
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json"
        },
        status: 500 
      }
    );
  }
});

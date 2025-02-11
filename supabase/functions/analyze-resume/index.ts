
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

    // Call APILayer PDF to Text API
    const apiLayerResponse = await fetch('https://api.apilayer.com/pdf_to_text/url', {
      method: 'POST',
      headers: {
        'apikey': Deno.env.get('APILAYER_API_KEY') ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: fileUrl
      })
    });

    if (!apiLayerResponse.ok) {
      const error = await apiLayerResponse.json();
      console.error('APILayer error:', error);
      throw new Error('Failed to extract text from resume');
    }

    const extractedText = await apiLayerResponse.text();
    console.log('Extracted text:', extractedText);

    // Call APILayer Resume Parser API
    const resumeParserResponse = await fetch('https://api.apilayer.com/resume_parser/url', {
      method: 'POST',
      headers: {
        'apikey': Deno.env.get('APILAYER_API_KEY') ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: fileUrl
      })
    });

    if (!resumeParserResponse.ok) {
      const error = await resumeParserResponse.json();
      console.error('Resume Parser error:', error);
      throw new Error('Failed to parse resume');
    }

    const parsedData = await resumeParserResponse.json();
    console.log('Parsed resume data:', parsedData);

    // Format the response
    const analysis = {
      summary: parsedData.professional_summary || "Professional summary not available",
      strengths: [
        parsedData.skills?.slice(0, 5) || [],
        parsedData.certifications || [],
        parsedData.accomplishments || []
      ].flat().slice(0, 5),
      improvements: [
        "Consider adding more quantifiable achievements",
        "Ensure all dates are in consistent format",
        "Add relevant certifications if applicable"
      ],
      keywords: parsedData.skills || []
    };

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

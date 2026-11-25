# AI Resume Analyser

Upload a resume (PDF) and get an AI analysis: a professional summary, key strengths, improvements, and keywords.

Built with Vite, TypeScript, React, shadcn-ui, Tailwind CSS, and Supabase. Resume text is extracted and parsed via APILayer, and results are stored in Supabase.

## Run it locally

```sh
npm install
npm run dev
```

The Supabase Edge Function `analyze-resume` in `supabase/functions/` needs `APILAYER_API_KEY` set in your Supabase project — no API keys are committed in this repo. The key in `src/integrations/supabase/client.ts` is Supabase's publishable (anon) key, which is designed for client-side use.

## License

MIT — see [LICENSE](LICENSE).

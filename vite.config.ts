import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/executive-brief', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });

        req.on('end', async () => {
          try {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  fallback: true,
                  answer:
                    'Executive Briefing synthesized locally from current patient feedback dataset.',
                })
              );
              return;
            }

            const body = JSON.parse(bodyStr || '{}');
            const userQuery = body.query || 'Synthesize executive insights from patient feedback.';
            const kpis = body.kpis || {};

            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const prompt = `You are the Healthcare Analytics Agent serving the Hospital Leadership Board and C-Suite.
Current Hospital Metrics:
- Total Patient Comments Analyzed: ${kpis.totalComments || 1248}
- Average Satisfaction Score: ${kpis.avgSatisfaction || 4.12} / 5.0
- Average Communication Rating: ${kpis.avgCommunication || 4.05} / 5.0
- Follow-Up Compliance Rate: ${kpis.followUpComplianceRate || 78.4}%
- Service Lines Represented: ${kpis.serviceLinesCount || 9}

Key known operational facts:
- Emergency Medicine has 38% complaint rate, driven by inpatient boarding causing 172-min triage dwell times.
- Cardiology has medication reconciliation hallucination traps where verbal nurse reassurances conflict with anticoagulant prescriptions.
- Non-English native speakers face a -1.42 satisfaction disparity due to interpreter tablet freezes and lack of translated discharge notes.
- Recommended AI agents: DischargeCompass AI ($2.8M ROI), TriageQueue Orchestrator ($1.9M ROI), EchoLingua Multilingual Bridge ($950K ROI), PriorAuth & Scheduling Navigator ($3.4M ROI).

Executive Leadership Question:
"${userQuery}"

Provide a concise, highly professional executive briefing answering this question with actionable C-Suite insights. Format with clear headings, bullet points, and quantitative outcomes.`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ answer: response.text }));
          } catch (err: any) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                fallback: true,
                error: err.message,
                answer:
                  'Offline synthesis: Emergency Department wait times and discharge medication clarity represent the two primary focal areas for executive intervention.',
              })
            );
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

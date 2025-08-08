import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { createTokenIfNeeded, mintReductionCredits } from './hedera.js';
import { runOptimizationAgent } from './agent.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const AI_URL = process.env.AI_URL || 'http://localhost:8001';

app.get('/api/health', (_, res) => res.json({ ok: true, service: 'backend', network: process.env.HEDERA_NETWORK || 'testnet' }));

app.post('/api/footprint', async (req, res) => {
  try {
    const body = req.body || {};
    const advanced = (req.query.advanced === 'true');
    const aiEndpoint = advanced ? '/predict_v2' : '/predict';
    const aiRes = await fetch(`${AI_URL}${aiEndpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!aiRes.ok) throw new Error(`AI service error: ${aiRes.status}`);
    const aiData = await aiRes.json();

    // Optional: run an autonomous optimization agent
    const agentSuggestions = await runOptimizationAgent(aiData);

    if (advanced) {
      // Pass through advanced metrics
      res.json({
        ok: true,
        mode: 'advanced',
        footprint: aiData.footprint_mean,
        ci: { low: aiData.ci_low, high: aiData.ci_high },
        breakdown: aiData.breakdown,
        abatement: aiData.abatement,
        tokenization: aiData.tokenization,
        notes: aiData.notes,
        suggestions: agentSuggestions,
      });
    } else {
      res.json({
        ok: true,
        mode: 'basic',
        footprint: aiData.footprint,
        notes: aiData.notes,
        suggestions: agentSuggestions,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/mint', async (req, res) => {
  try {
    const { amount = 1, memo = 'Carbon reduction credit', recipient } = req.body || {};
    const tokenId = await createTokenIfNeeded();
    const receipt = await mintReductionCredits(tokenId, amount, recipient);
    res.json({ ok: true, tokenId, receipt });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

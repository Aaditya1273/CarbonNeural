# Architecture Overview

- Frontend (React + Vite): user inputs, results, gamification.
- AI Service (FastAPI): `/predict` for footprint + notes.
- Backend (Express): routes `/api/footprint`, `/api/mint`, Hedera SDK integration, simple agent.
- Contracts: HTS via SDK for MVP; future Guardian + on-chain verification.

Sequence:
1. Frontend → Backend `/api/footprint`
2. Backend → AI `/predict`
3. Backend → Agent suggestions
4. Optional: Backend → Hedera mint CNC token

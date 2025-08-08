# Carbon-Neural: AI-Powered Decentralized Carbon Footprint Optimization on Hedera

Carbon-Neural is a hackathon-ready platform that combines AI-driven carbon footprint prediction, autonomous optimization agents, and Hedera Token Service (HTS) for tokenized carbon credits.

## Vision
- AI predicts and optimizes user/project emissions in real time.
- Verified reductions automatically mint carbon credits on Hedera.
- Autonomous agents suggest/enact sustainability improvements.
- Transparent, verifiable data (Guardian/Oracles) and a gamified dashboard.

## Repository Structure
```
carbon-neural/
├── contracts/                # Hedera HTS contracts/configs for carbon credit tokens
├── backend/                  # Node.js API + Hedera SDK + agents
├── ai/                       # Python FastAPI microservice for prediction/optimization
├── frontend/                 # React + Vite dashboard
├── data/                     # Sample datasets + oracle scripts
├── docs/                     # Pitch deck + architecture + demo guide
└── tests/                    # Unit + integration tests
```

## Quickstart

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- Hedera Testnet account (operator ID & private key)

### 1) AI Service (FastAPI)
```
cd ai
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```

### 2) Backend (Node.js + Hedera)
```
cd backend
npm install
copy .env.example .env  # set HEDERA_OPERATOR_ID + HEDERA_OPERATOR_KEY + AI_URL
npm run dev
```

### 3) Frontend (React + Vite)
```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 to view the dashboard.

## Demo Flow
1. Frontend calls Backend `/api/footprint` → Backend calls AI `/predict`.
2. AI returns estimated footprint + recommended optimizations.
3. If reduction verified, Backend can mint HTS carbon credit (testnet) → returns tx info.
4. Leaderboard and badges update in the UI.

## Environment Variables
Create `backend/.env`:
```
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=302e02...
AI_URL=http://localhost:8001
PORT=8080
```

## Roadmap
- Guardian integration for verifiable sustainability proofs
- On-chain verification contracts and attestation flow
- Advanced multi-sensor data ingestion + oracles
- Improved models (temporal, device graph, household/enterprise mode)
- Gamification: teams, seasons, NFT badges, staking

## License
MIT

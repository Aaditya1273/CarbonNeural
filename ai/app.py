from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="Carbon-Neural AI", version="0.1.0")

class Activity(BaseModel):
    # Minimal demo schema; extend for real signals
    device_hours: float = 2.0
    travel_km: float = 0.0
    grid_intensity: float = 300.0  # gCO2/kWh

class Prediction(BaseModel):
    footprint: float
    notes: list[str]

@app.get("/health")
def health():
    return {"ok": True, "service": "ai"}

@app.post("/predict", response_model=Prediction)
def predict(act: Activity):
    # Simple heuristic placeholder: footprint in kgCO2e
    device_factor = 0.2 * act.grid_intensity / 400.0
    travel_factor = 0.12  # kg/km approximate small car
    footprint = act.device_hours * device_factor + act.travel_km * travel_factor
    notes = []
    if act.grid_intensity > 350:
        notes.append("High grid carbon intensity; suggest renewable tariff")
    if act.device_hours > 5:
        notes.append("Reduce device active/standby hours")
    return {"footprint": round(float(footprint), 3), "notes": notes}

# --- Advanced endpoint with uncertainty and optimization ---
class AdvancedPrediction(BaseModel):
    footprint_mean: float
    ci_low: float
    ci_high: float
    breakdown: dict
    abatement: list
    tokenization: dict
    notes: list[str]

@app.post("/predict_v2", response_model=AdvancedPrediction)
def predict_v2(act: Activity):
    """
    Advanced calculation with simple Monte Carlo uncertainty and
    abatement optimization suggestions. All values are daily unless stated.
    """
    # Base factors
    device_factor = 0.2 * act.grid_intensity / 400.0  # kg per device-hour
    travel_factor = 0.12  # kg per km

    # Monte Carlo sampling for uncertainty
    rng = np.random.default_rng(42)
    n = 2000
    # Assume 10% std on inputs for demonstration
    dh_samples = rng.normal(act.device_hours, max(0.1, 0.1 * act.device_hours), n).clip(0)
    km_samples = rng.normal(act.travel_km, max(0.1, 0.1 * act.travel_km + 0.01), n).clip(0)
    gi_samples = rng.normal(act.grid_intensity, max(5.0, 0.1 * act.grid_intensity + 1.0), n).clip(50)

    device_factor_samples = 0.2 * gi_samples / 400.0
    fp_samples = dh_samples * device_factor_samples + km_samples * travel_factor
    mean = float(np.mean(fp_samples))
    low, high = [float(np.percentile(fp_samples, p)) for p in (5, 95)]

    # Deterministic breakdown from nominal values
    device_em = act.device_hours * device_factor
    travel_em = act.travel_km * travel_factor
    total = device_em + travel_em

    # Abatement suggestions with estimated reductions and simple MAC ($/t)
    # Costs are illustrative
    options = [
        {"name": "Renewable energy switch", "reduction": 0.20 * device_em, "mac": 5},
        {"name": "Standby scheduling", "reduction": 0.12 * device_em, "mac": -10},
        {"name": "EV / public transit", "reduction": 0.30 * travel_em, "mac": 45},
        {"name": "Eco-driving / route opt.", "reduction": 0.10 * travel_em, "mac": 2},
    ]
    # Sort by marginal abatement cost ascending (cheapest first)
    options.sort(key=lambda x: x["mac"])

    # Tokenization preview: assume 1 credit = 1000 kg CO2e, preview monthly accrual
    kg_per_credit = 1000.0
    monthly_emissions = total * 30.0
    credits_needed = max(0.0, monthly_emissions / kg_per_credit)
    time_to_one_credit_days = float(np.ceil(kg_per_credit / max(1e-6, total))) if total > 0 else 0

    notes = []
    if act.grid_intensity > 350:
        notes.append("High grid carbon intensity; renewable switch yields largest device-side impact.")
    if act.device_hours > 6:
        notes.append("Consider aggressive standby scheduling and power caps.")
    if act.travel_km > 20:
        notes.append("Mobility dominates; prioritize modal shift and eco-driving.")

    return {
        "footprint_mean": round(mean, 3),
        "ci_low": round(low, 3),
        "ci_high": round(high, 3),
        "breakdown": {
            "device": round(float(device_em), 3),
            "travel": round(float(travel_em), 3),
            "total": round(float(total), 3),
        },
        "abatement": [
            {"name": o["name"], "reduction": round(float(o["reduction"]), 3), "mac": o["mac"]}
            for o in options
        ],
        "tokenization": {
            "kg_per_credit": kg_per_credit,
            "monthly_emissions": round(float(monthly_emissions), 2),
            "credits_per_month": round(float(credits_needed), 4),
            "days_to_one_credit": time_to_one_credit_days,
        },
        "notes": notes,
    }

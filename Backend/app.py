from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

model = joblib.load("demand_model.pkl")
le_product = joblib.load("label_product.pkl")
le_country = joblib.load("label_country.pkl")

app = FastAPI(title="Nordic Retail Demand Forecasting API")

class ForecastInput(BaseModel):
    product_name: str
    month: int
    country: str
    avg_price: float
    promotion: int
    previous_sales: int
    season_index: float
    economic_index: float
    stock_level: int

@app.post("/forecast")
def forecast(data: ForecastInput):
    try:

        product_code = le_product.transform([data.product_name])[0]
        country_code = le_country.transform([data.country])[0]

        X = np.array([[
            product_code,
            data.month,
            country_code,
            data.avg_price,
            data.promotion,
            data.previous_sales,
            data.season_index,
            data.economic_index,
            data.stock_level
        ]])


        prediction = model.predict(X)[0]

        return {
            "success": True,
            "forecasted_sales": round(float(prediction), 2),
            "suggested_stock": round(prediction * 1.1, 2)
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

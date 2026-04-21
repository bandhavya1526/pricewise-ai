from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load Excel Dataset
file = "final_price_comparator_graph_ready_dataset.xlsx"

products = pd.read_excel(file, sheet_name="Products_Master")
history = pd.read_excel(file, sheet_name="Price_History_30Days")


# Home Route
@app.route("/")
def home():
    return "Python Backend Running 🚀"


# Get All Products
@app.route("/api/products")
def get_products():
    return products.to_json(orient="records")


# Get Single Product by ID
@app.route("/api/products/<id>")
def get_product(id):
    item = products[products["Product_ID"] == int(id)]
    return item.to_json(orient="records")


# Get Price History
@app.route("/api/history/<id>")
def get_history(id):
    item = history[history["Product_ID"] == int(id)]
    return item.to_json(orient="records")


# Prediction API
@app.route("/api/predict/<id>")
def predict(id):
    return jsonify([
        {"day": "Tomorrow", "price": 68000},
        {"day": "3 Days", "price": 67500},
        {"day": "7 Days", "price": 66900}
    ])


# Buy / Wait Recommendation
@app.route("/api/recommend/<id>")
def recommend(id):
    return jsonify({
        "recommendation": "WAIT",
        "reason": "Expected price drop in 7 days"
    })


# Run Server
if __name__ == "__main__":
    app.run(debug=True, port=5000)
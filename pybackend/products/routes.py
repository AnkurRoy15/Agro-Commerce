from flask import Blueprint, jsonify, current_app
from bson import json_util
import json

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    try:
        agroai_db = current_app.extensions['mongo_ai'].agroai
        raw_products = list(agroai_db.crops.find({}))

        products = []
        for p in raw_products:
            products.append({
                "_id": str(p["_id"]),
                "name": p.get("name", ""),
                "price": p.get("price", 0),
                "quantity": p.get("quantity", 0),
                "image_id": str(p["image_id"]) if "image_id" in p and p["image_id"] else "",
                "user_id": str(p.get("user_id", "")),
                "created_at": p.get("created_at")  # Optional: convert to str() if needed
            })
        print(p)
        return jsonify({
            "success": True,
            "data": products,
            "message": "Products fetched successfully"
        })


    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Failed to fetch products",
            "error": str(e)
        }), 500
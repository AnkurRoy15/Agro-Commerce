from datetime import datetime
from bson import ObjectId
from flask import  Blueprint, current_app, jsonify, request

checkout_bp = Blueprint('checkout', __name__)

@checkout_bp.route('/api/checkout', methods=['POST'])
def checkout():
    try:
        agroai_db = current_app.extensions['mongo_ai'].agroai
        data = request.json
        
        # Validate required fields
        if not all(key in data for key in ['items', 'buyerId']):
            return jsonify({"success": False, "message": "Missing required fields"}), 400
        
        # Create notification for each item
        notifications = []
        for item in data['items']:
            notification = {
                "image_id": item.get('image_id', ''),
                "toUserId": item.get('toUserID', ''),  # Assuming items have sellerId
                "cropName": item['name'],
                "quantity": item['quantity'],
                "totalPrice": item['price'] * item['quantity'],
                "buyerId": ObjectId(data['buyerId']),
                "timestamp": datetime.utcnow(),
                "status": "pending"
            }
            notifications.append(notification)
        
        # Insert into notifications collection
        result = agroai_db.notifications.insert_many(notifications)
        
        return jsonify({
            "success": True,
            "message": "Order placed successfully",
            "notificationIds": [str(id) for id in result.inserted_ids]
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
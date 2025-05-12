from flask import Blueprint, jsonify
from extensions import mongo

banner_bp = Blueprint('banner', __name__, url_prefix='/api')

@banner_bp.route('/banners', methods=['GET'])
def get_banners():
    try:
        banners_cursor = mongo.db.banners.find({"is_active": True})
        banners = []
        for banner in banners_cursor:
            banners.append({
                "id": str(banner["_id"]),
                "title": banner.get("title", ""),
                "imageUrl": banner.get("image_url", ""),
                "targetUrl": banner.get("target_url", "")
            })
        return jsonify(banners), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

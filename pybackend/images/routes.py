from flask import Blueprint, Response, current_app, jsonify
from bson import ObjectId
import base64


images_bp = Blueprint('images', __name__)


@images_bp.route('/images/<image_id>', methods=['GET'])
def get_image(image_id):
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(image_id):
            return jsonify({"success": False, "message": "Invalid image ID format"}), 400

        images_collection = current_app.extensions['mongo_ai'].agroai.images
        image = images_collection.find_one({"_id": ObjectId(image_id)})

        if not image:
            return jsonify({"success": False, "message": "Image not found"}), 404

        # Check for both 'base64' (string) and 'image_data' (Binary) fields
        image_data = None
        content_type = "image/jpeg"  # default

        if 'image_data' in image:
            # Handle Binary BSON data
            image_data = image['image_data']
            content_type = image.get('content_type', 'image/jpeg')
            return Response(image_data, mimetype=content_type)

        elif 'base64' in image:
            # Handle legacy base64 string (your original code)
            base64_data = image['base64']
            if isinstance(base64_data, bytes):
                base64_data = base64_data.decode('utf-8')

            if base64_data.startswith("data:"):
                content_type = base64_data.split(";")[0].replace("data:", "")
                base64_data = base64_data.split(",", 1)[1]

            image_data = base64.b64decode(base64_data)
            return Response(image_data, mimetype=content_type)

        else:
            return jsonify({"success": False, "message": "No image data found"}), 404

    except Exception as e:
        print(f"Error in get_image: {str(e)}")
        return jsonify({"success": False, "message": "Error retrieving image"}), 500
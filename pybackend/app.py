from flask import Flask, send_from_directory
from config import Config
from extensions import mongo, jwt
from flask_cors import CORS
from pymongo import MongoClient
import os
import logging

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:19006", 
                "exp://your-expo-url"
            ],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Authorization", "Content-Type"]
        }
    })

    logging.getLogger("pymongo").setLevel(logging.CRITICAL)
    for logger_name in ["pymongo.server", "pymongo.topology", "pymongo.pool", "pymongo.monitoring"]:
        logging.getLogger(logger_name).setLevel(logging.CRITICAL)


    
    # Initialize primary database connection (agrocommerce)
    mongo.init_app(app, uri=app.config['MONGO_URI'])
    
    # Initialize secondary database connection (agroai)
    mongo_ai = MongoClient(app.config['MONGODB_URI_AGROAI'])
    app.extensions['mongo_ai'] = mongo_ai  # Store in app extensions
    
    # Initialize JWT
    jwt.init_app(app)
    

    # Register blueprints
    from auth.routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    from banners.routes import banner_bp
    app.register_blueprint(banner_bp)

    @app.route('/uploads/<path:filename>')
    def serve_uploaded_images(filename):
        uploads_path = os.path.join(os.getcwd(), 'uploads')
        return send_from_directory(uploads_path, filename)
    
    from products.routes import products_bp
    from images.routes import images_bp

    app.register_blueprint(products_bp, url_prefix='/api')
    images_bp.mongo_ai = mongo_ai  # if needed
    app.register_blueprint(images_bp,url_prefix='/api')

    from checkout.routes import checkout_bp
    app.register_blueprint(checkout_bp)
    
    @app.teardown_appcontext
    def teardown_db(exception):
        if hasattr(app, 'mongo_ai'):
            app.mongo_ai.close()
    
    return app
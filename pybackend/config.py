import os
from dotenv import load_dotenv
from datetime import timedelta
import logging

load_dotenv()

class Config:
    # MongoDB Configuration
    logging.getLogger("pymongo").setLevel(logging.CRITICAL)
    for logger_name in ["pymongo.server", "pymongo.topology", "pymongo.pool", "pymongo.monitoring"]:
        logging.getLogger(logger_name).setLevel(logging.CRITICAL)

    MONGO_URI = os.getenv('MONGO_URI')
    MONGODB_URI_AGROAI = os.getenv('MONGODB_URI_AGROAI')
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 86400))
    )
    
    # Server Configuration
    PORT = int(os.getenv('PORT', 5000))
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')


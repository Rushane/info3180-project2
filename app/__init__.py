from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect 
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'v\xf9\xf7\x11\x13\x18\xfaMYp\xed_\xe8\xc9w\x06\x8e\xf0f\xd2\xba\xfd\x8c\xda'
#app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:project2@localhost/project2"
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://qfeyffwhdwnxgz:a59656f8d9daab3e461a7fa7096730c53969f7432e3fb0b80e5630f73d791c75@ec2-50-17-227-28.compute-1.amazonaws.com:5432/d2o6e4huklcd45"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning
app.config['UPLOAD_FOLDER'] = "./app/static/uploads"
PROFILE_IMG_UPLOAD_FOLDER = os.path.join("static/uploads", "profile_photos")

db = SQLAlchemy(app)
csrf = CSRFProtect(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config.from_object(__name__)
from app import views



from . import db
from werkzeug.security import generate_password_hash

class UserProfile(db.Model):
    # You can use this to change the table name. The default convention is to use
    # the class name. In this case a class name of UserProfile would create a
    # user_profile (singular) table, but if we specify __tablename__ we can change it
    # to `user_profiles` (plural) or some other name.
    __tablename__ = 'Users' # table name users

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(255))
    firstname = db.Column(db.String(80))
    lastname = db.Column(db.String(80))
    gender = db.Column(db.String(10))
    email = db.Column(db.String(80))
    location = db.Column(db.String(80))
    biography = db.Column(db.String(300))
    joined_on = db.Column(db.String(40))
    profile_photo = db.Column(db.String(200))
    
    
    def __init__(self, username, password, firstname,lastname,gender,email,location,biography,joined_on,profile_photo):
        self.username = username
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.firstname = firstname
        self.lastname = lastname
        self.gender = gender
        self.email = email
        self.location = location
        self.biography = biography
        self.joined_on = joined_on
        self.profile_photo = profile_photo
        
    

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)

class PostModel(db.Model):
    __tablename__ = 'Posts' # table name posts

    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, unique=True)
    photo = db.Column(db.String(200))
    caption = db.Column(db.String(255))
    created_on = db.Column(db.String(40))
    
    
    def __init__(self, user_id, photo,caption,created_on):
        self.user_id = user_id
        self.photo = photo
        self.caption = caption
        self.created_on = created_on
        
    def get_id(self):
        try:
            return unicode(self.userid)  # python 2 support
        except NameError:
            return str(self.userid)  # python 3 support
            
class Follows(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True)
    follower_id = db.Column(db.Integer, unique=True)
    
    def __init__(self,user_id, follower_id):
        self.user_id = user_id
        self.follower_id = follower_id
        
class Likes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True)
    post_id = db.Column(db.Integer, unique=True)
    
    def __init__(self,post_id,user_id):
        self.user_id = user_id
        self.post_id = post_id
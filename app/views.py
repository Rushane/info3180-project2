"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os
from app import app, db, login_manager
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app.forms import LoginForm, ProfileForm, PostForm
from werkzeug.utils import secure_filename
from app.models import UserProfile, PostModel, Follows, Likes
import datetime
from werkzeug.security import check_password_hash
import jwt
from functools import wraps


###
# Routing for your application.
###

def token_authenticate(t):
    @wraps(t)
    def decorated(*args, **kwargs):
        
        auth = request.headers.get('Authorization', None)
        
        if not auth:
            return jsonify({'error': 'Access Denied : No Token Found'}), 401
        else:
            try:
                userdata = jwt.decode(auth.split(" ")[1], app.config['SECRET_KEY'])
                currentUser = UserProfile.query.filter_by(username = userdata['user']).first()
                
                if currentUser is None:
                    return jsonify({'error': 'Access Denied'}), 401
                
            except jwt.exceptions.InvalidSignatureError as e:
                print(e)
                return jsonify({'error':'Invalid Token'})
            except jwt.exceptions.DecodeError as e:
                print(e)
                return jsonify({'error': 'Invalid Token'})
            return t(*args, **kwargs)
    return decorated

@app.route('/')
def index():
    """Render the initial webpage and then let VueJS take control."""
    return render_template('index.html')
    
# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages


@app.route('/api/users/register',  methods=["POST"])
def register():
    """ Renders user registration page"""
    form = ProfileForm()
    
    if request.method == 'POST' and form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        firstname = form.firstname.data
        lastname = form.lastname.data
        location = form.location.data
        email = form.email.data
        biography = form.biography.data
       
        photo = form.profile_photo.data
        filename = secure_filename(photo.filename)
        #photo.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
        photo.save(os.path.join("./app",app.config['PROFILE_IMG_UPLOAD_FOLDER'], filename))
    
        date_created = datetime.datetime.now().strftime("%B %d, %Y")
        
        new_user = UserProfile(username=username,password=password,firstname=firstname, lastname=lastname, biography=biography, profile_photo=filename,
             location=location, joined_on=date_created, email=email)
        db.session.add(new_user)
        db.session.commit()
       
        return jsonify(message="User successfully registered")

@app.route('/api/users/<user_id>/posts',  methods=["GET", "POST"])
@token_authenticate
def posts(user_id):
    """ Renders post page"""
    form = PostForm()
    #uid=session['user_id']
    cid = session['current_user']
    if request.method == 'GET':
        user = UserProfile.query.filter_by(id=cid).first()
        data={'id':user.id,'username':user.username,'firstname':user.firstname,
           'lastname':user.lastname,'location':user.location,'profile_photo':'/static/uploads/'+user.profile_photo,'biography':user.biography,'joined':user.joined_on}
        
        
        posts=PostModel.query.filter_by(user_id = cid).all()
        follows=Follows.query.filter_by(user_id=cid).all()
        following=Follows.query.filter_by(follower_id=session['userid'], user_id=cid).first()
        isfollowing=''
        if following is None:
            isfollowing='No'
        else:
            isfollowing='Yes'

        return jsonify(user = cid, response=[{'posts':[postinfo(posts)],'postamt':len(posts),'follows':len(follows),'data':data,'following':isfollowing}])
        
    if request.method == 'POST' and form.validate_on_submit:
        user = UserProfile.query.filter_by(id=user_id).first()
        caption = form.caption.data
        #user_id=u_id
        u_id = user_id
        
        photo = form.photo.data
        filename = secure_filename(photo.filename)
        photo.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
        
        date_created = datetime.datetime.now().strftime("%B %d, %Y")
        
        new_post = PostModel(user_id=u_id,photo=filename,caption=caption, created_on=date_created)
            
        db.session.add(new_post)
        db.session.commit()
       
        return jsonify({'message':'Successfully created a new post'})
    return jsonify({"message": "Bad Request"})
 

# double check this view function 
@app.route("/api/users/<user_id>/follow", methods= ['POST'])
@token_authenticate
def follow(user_id):
    """ Follow a user"""
    user = UserProfile.query.filter_by(id=user_id).first()
    
    if request.method == 'POST':
        
        follow = Follows(user_id, session['current_user'])
        
        db.session.add(follow)
        db.session.commit
        follows = len(Follows.query.filter_by(user_id = user_id).all())

        msg = {"message": "You are now following that user.", "followers": follows}
        return jsonify(msg)
    return jsonify(["Bad Request"])
    
@app.route("/api/posts", methods= ['GET'])
@token_authenticate
def allposts():
    """Return all posts for all users"""
    if request.method == 'GET':
        
        posts=PostModel.query.order_by(PostModel.created_on.desc()).all()
        return jsonify(response=[{"posts":postinfo(posts)}])
    return jsonify(['Bad Request'])
    
@app.route("/api/posts/<post_id>/like", methods= ['POST'])
@token_authenticate
def like(post_id):
    """ Like a post """
    
    post = PostModel.query.filter_by(post_id).first()
    
    if request.method == 'POST':
        
        like = Likes(session['current_user'],post_id)
        
        db.session.add(like)
        db.session.commit
        likes = len(Likes.query.filter_by(post_id = post_id).all())
        msg = {"message": "Post Liked!", "likes": likes}
        return jsonify(msg)
    return jsonify(["Bad Request"])
    
def jdefault(o):
    if isinstance(o, set):
        return list(o)
    return o.__dict__
    
def jsonDefault(o):
    return o.decode('utf-8')

@app.route("/api/auth/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if request.method == "POST" and form.validate_on_submit():
        # Get the username and password values from the form.

        # using your model, query database for a user based on the username
        # and password submitted. Remember you need to compare the password hash.
        # You will need to import the appropriate function to do so.
        # Then store the result of that query to a `user` variable so it can be
        # passed to the login_user() method below.
        username = form.username.data
        password = form.password.data

        # user = UserProfile.query.filter_by(username=username, password=password)\
        # .first()
        # or
        user = UserProfile.query.filter_by(username=username).first()
        
        if user is not None and check_password_hash(user.password, password):
            payload = {'user': user.username}
            #token = jwt.encode(payload, "gazacat").decode('utf-8')
            token = jwt.encode({'user': user.username},app.config['SECRET_KEY'],algorithm = "HS256")
            msg = {'message': 'User successfully logged in','token':token, "user_id": user.id}
            
            """payload = {'current_user' : user.id}
            token  = jwt.encode({'user': user.username},app.config['SECRET_KEY'],algorithm = 'HS256')
            session['current_user'] = user.id;
            msg = {"message": "User successfully logged in.",'token':token,'current_user':user.id}
            login_user(user)
            next_page = request.args.get('next') """
            
            #jwt.decode(encoded_jwt, 'secret', algorithms=['HS256']){'some': 'payload'}

            
            #payload = {'current_user' : user.id}
            #token  = jwt.encode({'user': user.username},app.config['SECRET_KEY'],algorithm = 'HS256')
            #session['current_user'] = user.id;
            #msg = {"message": "User successfully logged in.",'token':token,'current_user':user.id}
            #login_user(user)
            #next_page = request.args.get('next')
            
            #import json
            #json.dumps(msg, default=jdefault)
            import json
            return json.dumps(msg, default=jsonDefault)
           
        return jsonify(errors="Username or password is incorrect")
        
    return jsonify(errors=form_errors(form))
    
@app.route("/api/auth/logout", methods = ['GET'])
@token_authenticate
def logout():
    # Logout the user and end the session
    if request.method == 'GET':
        # Logout the user and end the session
        #logout_user()
        msg = {"message": "User successfully logged out."}
        return jsonify(msg)
    return jsonify({"message": "Bad Request"})
    
def postinfo(posts):
    likes='';
    newposts=[]
    for i in range (0,len(posts)):
        user=UserProfile.query.filter_by(id=posts[i].user_id).first();
        username=user.username;
        profile_photo=user.profile_photo;
        liked=Likes.query.filter_by(post_id=posts[i].id,user_id=session['current_user']).first()
        if liked is None:
            l='No'
        else:
            l='Yes'
        x={
        'id':posts[i].id,
        'user_id':posts[i].user_id,
        'photo':"/static/uploads/"+posts[i].photo,
        'caption':posts[i].caption,
        'created_on':posts[i].created_on,
        'likes':likeamt(posts[i].id),
        'username':username,
        'userphoto':'/static/uploads/'+profile_photo,
        'likes':l
        }
        newposts.append(x)
    return newposts
    
def likeamt(post_id):
    count=Likes.query.filter_by(post_id=post_id).all()
    return len(count)


###
# The functions below should be applicable to all Flask apps.
###

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")

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
from app.models import UserProfile, PostModel, Follows
import datetime
from werkzeug.security import check_password_hash

###
# Routing for your application.
###
@app.route('/api/users/register',  methods=["GET", "POST"])
def register():
    """ Renders user registration page"""
    form = ProfileForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            username = form.username.data
            password = form.password.data
            firstname = form.firstname.data
            lastname = form.lastname.data
            location = form.location.data
            email = form.email.data
            biography = form.biography.data
            gender = form.gender.data
            
            #form.photo.label.text = 'Browse...'
            photo = form.profile_photo.data
            filename = secure_filename(photo.filename)
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
            
            
            date_created = datetime.datetime.now().strftime("%B %d, %Y")
            
            new_user = UserProfile(username=username,password=password,firstname=firstname, lastname=lastname, biography=biography, profile_photo=filename,
                gender=gender, location=location, joined_on=date_created, email=email)
                
            db.session.add(new_user)
            db.session.commit()
           
            # return jsonify(message="User successfully registered")
            flash('User successfully registered', 'success')
            return redirect(url_for("home"))
    return render_template('register.html',form=form)
    
@app.route('/api/users/<user_id>/posts',  methods=["GET", "POST"])
def posts(user_id):
    """ Renders post page"""
    form = PostForm()
    #u_id=session['user_id']
    if request.method == 'GET':
        posts = PostModel.query.filter_by(user_id=user_id).all()
        
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
       
        flash('Successfully created a new post', 'success')
        return redirect(url_for("home"))
    return render_template('newpost.html',form=form, user=user)
 

# double check this view function 
@app.route("/api/users/<user_id>/follow", methods= ['POST'])
def follow(user_id):
    """ Follow a user"""
    user = Users.query.filter_by(id=user_id).first()
    
    if request.method == 'POST':
        
        follow = Follows(user_id, session['current_user'])
        
        db.session.add(follow)
        db.session.commit
        follows = len(Follows.query.filter_by(user_id = user_id).all())

        msg = {"message": "You are now following that user.", "followers": follows}
        return jsonify(msg)
    return jsonify(["Bad Request"])
    
@app.route("/api/posts", methods= ['GET'])
def allposts():
    """Return all posts for all users"""
    if request.method == 'GET':
        
        posts=PostModel.query.order_by(Posts.created_on.desc()).all()
    return jsonify(['Bad Request'])
    
@app.route("/api/users/<post_id>/like", methods= ['POST'])
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
    
    


@app.route('/')
def home():
    """Render website's home page."""
    return render_template('home.html')
    
# @app.route('/')
# def index():
#     """Render the initial webpage and then let VueJS take control."""
#     return app.send_static_file('index.html')


@app.route('/about/')
def about():
    """Render the website's about page."""
    return render_template('about.html')


@app.route("/api/auth/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if request.method == "POST":
        # change this to actually validate the entire form submission
        # and not just one field
        if form.validate_on_submit():
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
                # get user id, load into session
                login_user(user)
                # remember to flash a message to the user
                flash('Logged in successfully.', 'success')
                
                next_page = request.args.get('next')
                return redirect(next_page or url_for("home"))  # this should change
            else:
                flash('Username or Password is incorrect.', 'danger')
    return render_template("login.html", form=form)
    
@app.route("/api/auth/logout", methods = ['GET'])
@login_required
def logout():
    # Logout the user and end the session
    logout_user()
    flash('You have been logged out.', 'danger')
    return redirect(url_for('home'))


# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
@login_manager.user_loader
def load_user(id):
    return UserProfile.query.get(int(id))

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
    and also to cache the rendered page for 10 minutes.
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

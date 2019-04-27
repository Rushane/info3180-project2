Vue.component('app-header', {
    template: `
        <header>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
              <img src='static/images/photo_icon.png' class="small-size"/>
              <a class="navbar-brand" href="#">Photogram</a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>

              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    
                </ul>
              </div>
              
            <ul class="navbar-nav">
            <li class="nav-item active">
                <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item active">
                    <router-link to="/explore" class="nav-link">Explore</router-link>
            </li>
            <li class="nav-item active">
                    <router-link class="nav-link" to="/users/{userid}">My Profile <span class="sr-only">(current)</span></router-link>
           </li>
            <li v-if="auth" class="nav-item active">
              <router-link class="nav-link" to="/logout">Logout</router-link>
            </li>
            <li v-else class="nav-item">
              <router-link class="nav-link active" to="/login">Login</router-link>
            </li>
        </ul>
              
            </nav>
        </header>    
    `,
    data: function() {}
});

Vue.component('app-footer', {
    template: `
        <footer>
            <div class="container">
                <p>Copyright &copy {{ year }} Flask Inc.</p>
            </div>
        </footer>
    `,
    data: function() {
        return {
            year: (new Date).getFullYear()
        }
    }
});


const Home = Vue.component('home', {
 template: `
     <div class="row coffee-container">
        <div class="col-md-4 coffee-container-child" style="margin-left: 11%;">
            <img src="/static/images/Coffee.jpeg" id="coffee-img"/>
        </div>
        <div class="col-md-4  coffee-container-child float-clear">
          <div class="card" style="width: 28rem; height: 23rem; box-shadow: 2px 2px 10px grey;">
            <img class="card-img-top" src="static/images/photogramLogo.png" alt="Card image cap" style="width: 60%; margin: 0 auto; padding-top: 20px;">
            <div class="card-body" style="padding-top: 0px;">
              <hr>
              <p class="card-text">{{photogram_body2}}</p>
              <div style="margin-top: 20%;">
                  <router-link class="btn btn-success col-md-5" to="/register">Register</router-link>
                  <router-link class="btn btn-primary col-md-5" to="/login">Login</router-link>
              </div>
            </div>
          </div>  
        </div>
    </div>
    
     `,
     data: function() {
        return {
            welcome: 'Photogram',
            photogram_body1: 'Photogram is a fictional clone of Instagram.',
            photogram_body2: 'Users can post photos to share with their family and friends as well as "like" and "follow" other users.'
        }
     }
});

const Register = Vue.component('register', {
    template: 
    `
    <div class= "form" >
   <link rel="stylesheet" type="text/css" href="static/css/main.css">
        <p v-if="errors.length" class="alert alert-danger">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </p>
   
       <form id= "ProfileForm" class="form-register" @submit.prevent="registerP" method="POST" enctype = "multipart/form-data" action="/api/users/register">
            <h2>Register</h2>
          
            <label> Username</label>
            <input type="text" name="username" class="form-group form-control" id ="username">
    
            <label>Password</label>
            <input type="password" name="password" class="form-group form-control" id ="password">
    
            <label>First Name</label>
            <input type="text" name="firstname" class="form-group form-control" id ="firstname">
    
            <label>Last Name</label>
            <input type="text" name="lastname" class="form-group form-control" id ="lastname">
    
            <label>Email</label>
            <input type="text" name="email" class="form-group form-control" id ="email">
    
            <label>Location</label>
            <input type="text" name="location" class="form-group form-control" id ="location">
    
            <label>Biography</label>
            <textarea name="biography" class="form-group form-control" id="biography"> </textarea>
    
            <label>Photo</label>
            <input type="file" name="profile_photo" class="form-group form-control" id="profile_photo">
            
          <button class="btn btn-success btn-block" type="submit">Register</button>
        </form>
    </div>
   `,
   methods : {
    registerP : function(){
        let self = this;
        let ProfileForm = document.getElementById('ProfileForm');
        let form_data = new FormData(ProfileForm);
        
        fetch("/api/users/register", {
        method: 'POST',
        body : form_data,
        headers: {
            'X-CSRFToken': token
            },
            credentials: 'same-origin'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
        // display a success 
            let jwt_token = jsonResponse.token;
            let current_user = jsonResponse.current_user;

            // We store this token in localStorage so that subsequent API requests
            // can use the token until it expires or is deleted.
            localStorage.setItem('token', jwt_token);
            localStorage.setItem('current_user', current_user)
            console.info('Token generated and added to localStorage.');
            
            this.errors = [];
            self.errors = jsonResponse.errors;
            router.push("/login");
            console.log(jsonResponse);
        })
        .catch(function (error) {
            console.log(error);
        });
                }
        },
    data : function(){
        return {
            errors:[], 
            token: ''
        }
    }

});

const Login = Vue.component('login', {
   template: `
   <div class= "form" >
   <link rel="stylesheet" type="text/css" href="static/css/main.css">
        <p v-if="errors.length" class="alert alert-danger">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </p>
   
       <form id= "LoginForm" class="form-login" @submit.prevent="Login" method="POST" enctype = "multipart/form-data">
            <h2>Login</h2>
          
            <div class="form-group">
                <label for="username" class="sr-only">Username</label>
                <input type="text" id="username" name="username" class="form-control" placeholder="Your username" required >
            </div>
            <div class="form-group">
                <label for="password" class="sr-only">Password</label>
                <input type="password" id="password" name="password" class="form-control" placeholder="Password" required>
            </div>
          <button class="btn btn-success col-md-5" type="submit">Login</button>
        </form>
    </div>
   `,
   methods : {
    LoginForm : function(){
        let self = this;
        let LoginForm = document.getElementById('LoginForm');
        let form_data = new FormData(LoginForm);
        fetch("/api/auth/login", {
        method: 'POST',
        body : form_data,
        headers: {
            'X-CSRFToken': token
            },
            credentials: 'same-origin'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
        // display a success 
            let jwt_token = jsonResponse.token;
            let current_user = jsonResponse.current_user;

            // We store this token in localStorage so that subsequent API requests
            // can use the token until it expires or is deleted.
            localStorage.setItem('token', jwt_token);
            localStorage.setItem('current_user', current_user)
            console.info('Token generated and added to localStorage.');
            
            this.errors = [];
            self.errors = jsonResponse.errors;
            router.push("/explore");
            console.log(jsonResponse);
        })
        .catch(function (error) {
            console.log(error);
        });
                }
        },
    data : function(){
        return {
            errors:[], 
            token: ''
        }
    }

});

const Explore = Vue.component("explore", {
  template:`
    <div class="row">
      
      <div v-if="postFlag" class="col-md-7" style="margin: 0 auto;">
        <div class="card" style=" width:100%; padding: 0; margin-bottom: 5%" v-for="(post, index) in posts">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <img id="pro-photo" v-bind:src=post.user_profile_photo style="width:40px"/>
              <router-link class="username" :to="{name: 'users', params: {user_id: post.user_id}}">{{ post.username }}</router-link>
            </li>
            <li class="list-group-item" style="padding: 0;">
              <img id="post-img" v-bind:src=post.photo style="width:100%" />
            </li>
            <li class="list-group-item text-muted">
              {{ post.caption }}
              <div class="row" style="margin-top: 10%">
                <div id="likes" class="col-md-6" style="text-align: left;">
                  <img class="like-ico liked" src="static/icons/liked.png"  v-on:click="like" style="width:20px; display: none;"/>
                  <img class="like-ico like" src="static/icons/like.png"  v-on:click="like" style="width:20px;"/> {{post.likes}} Likes
                  
                  <input type="hidden" id="post-id"  v-bind:value="post.id" />
                  <input type="hidden" id="post-index" v-bind:value="index" />
                </div>
                <div id="post-date" class="col-md-6" style="text-align: right">
                  {{post.created_on}}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <div class="alert alert-primary" >
          No posts.
        </div>
      </div>
        
      <div class="col-md-3">
        	<router-link class="btn btn-primary" to="/posts/new" style="width:100%;">New Post</router-link>
      </div>
    </div>
  `,
  created: function(){
    self = this;
    
    fetch("/api/posts", {
      method: "GET",
      headers:{
        "Authorization": `Bearer ${JSON.parse(localStorage.current_user).token}`,
        'X-CSRFToken': token
      },
      credentials: 'same-origin'
    }).then(function(response){
      return response.json();
    }).then(function(jsonResponse){
      if(jsonResponse.hasOwnProperty("posts")){
        if(jsonResponse.posts.length !=0){
          self.posts = jsonResponse.posts.reverse();
          self.postFlag = true;
        }
      }
    }).catch(function(error){
      console.log(error);
    });
  },
  methods: {
    like: function(event){
      self = this;
      let node_list = event.target.parentElement.children;
      let post_id = node_list[node_list.length-2].value;
      let post_index = node_list[node_list.length-1].value;
      
      fetch(`/api/posts/${post_id}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.current_user).token}`,
          'X-CSRFToken': token,
          'Content-Type': 'application/json'
        },
        credentials: "same-origin",
        body: JSON.stringify({"user_id": JSON.parse(localStorage.current_user).id, "post_id": post_id})
      }).then(function(response){
        return response.json();
      }).then(function(jsonResponse){
        
        if(jsonResponse.hasOwnProperty("status")){
          if(jsonResponse.status == 201){
            event.target.style.display="none"
            event.target.previousElementSibling.style.display="";
            self.posts[post_index].likes = jsonResponse.likes;
          }
        }
      }).catch(function(error){
        console.log(error);
      });
    }
  },
  data: function(){
    return {
      posts: [],
      postFlag: false
    }
  }
});

const NewPost = Vue.component('post', {
   template: `
   <div class= "form" >
   <link rel="stylesheet" type="text/css" href="static/css/main.css">
        <p v-if="errors.length" class="alert alert-danger">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </p>
   
       <form id= "PostForm" class="form-login" @submit.prevent="Post" method="post" enctype="multipart/form-data">
            <h2>New Post</h2>
          
            <div class="form-group">
            
            <label>Photo</label>
            <input type="file" name="photo" class="form-group form-control">
            
            <label>Caption</label>
            <textarea name="caption" class="form-group form-control"> </textarea>
    
            <input type="submit" class="btn btn-success col-md-5" >
                
            </div>
        </form>
    </div>
   `,
   methods : {
    Post : function(){
        let self = this;
        this.token = localStorage.getItem('token');
        let PostForm = document.getElementById('PostForm');
        let form_data = new FormData(PostForm);
        let current_user = localStorage.getItem('current_user');
        fetch("/api/users/"+current_user+"/posts", {
        method: 'POST',
        body : form_data,
        headers: {
            'X-CSRFToken': token,
            'Authorization': 'Bearer '  + localStorage.getItem('token')
            },
            credentials: 'same-origin'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
        // display a success 
            this.errors = [];
            self.errors = jsonResponse.errors;
            router.push("/explore");
            alert("Post added!")
            console.log(jsonResponse);
        })
        .catch(function (error) {
            console.log(error);
        });
                }
        
        },
    data : function(){
        return {
            errors:[],
            response: '',
            token: ''
        }
    }
});

const MyProfile = Vue.component("MyProfile",{
    template:`
    <div>
     <div id="profile" class="container shadow jumbotron sticky-top" >
                    <div class="row">
                        <div> 
                            <img class="displayphoto" v-bind:src="data.profile_photo" />
                        </div>
                        <div >
                            <div>
                                <h4>{{data.firstname}}<span> {{data.lastname}}</span></h4>
                                <br>
                                <p class="lead">{{data.location}} <br>Member since {{data.joined_on}}</p>
                                <p class="lead">{{data.biography}}</p> 
                            </div>
                            <div class="row col-lg-6 col-md-3">
                                <div >
                                    <h4><span class="colors">{{postamt}}</span></br>Posts</h4>
                                
                                    <h4><span class="colors">{{follows}}</span></br>Followers</h4>
                                </div>
                            </div>
                            <div class="col-lg-8 float-right followbutton col-md-6">
                                <form method="POST" @submit.prevent="follow">
                                    <input  id='userid' type="hidden" :value=data.id >
                                    <div v-if="toshow=='Yes'">
                                        <button id='follow' class="btn btn-primary col-lg-12 col-md-6" >Follow</button>
                                    </div>
                                    <div v-else>
                                        <button disabled class="btn btn-success col-lg-12 col-md-6" >Follow</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container" v-if="posts.length > 0">
                    <div class="row" v-for='n in rows'>
                        <hr class="col-md-11">
                        <div v-if="n-1 < posts.length" class="col-lg-4"> 
                            <img class="postphotos" v-bind:src="posts[n-1]['photo']" />
                        </div>
                        <div v-if="n-1+1 < posts.length" class="col-lg-4"> 
                            <img class="postphotos" v-bind:src="posts[n-1+1]['photo']" />
                        </div>
                        <div v-if="n-1+2 < posts.length" class="col-lg-4">
                           <img class="postphotos" v-bind:src="posts[n-1+2]['photo']" />
                        </div>

                    </div>
                </div>
                <div v-else>
                    <h3>No posts yet</h3>
                </div>
            </div>
            </div>
`,
        methods:{
        follow: function(){
            let self = this;
            let followid=document.getElementById('userid').value;
            let followcount=document.getElementById('followers').innerHTML;
            followcount=parseInt(followcount)+1;
            data = new FormData(body);
            fetch('/api/users/'+follow_id+'/follow',{
                method:'POST',
                body:data,
                headers:{
                    'X-CSRFToken' : token,
                    'Authorization': 'Bearer '  + localStorage.getItem('token')
                },
                credentials:'same-origin'
            })
            .then(function(response){
                return response.json();
            })
            .then(function(jsonResonse){
                self.response = jsonResonse.message;
                //console.log(jsonResonse);

                if(jsonResonse.newRelationship == 'true'){
                    fetch('/api/users/' + self.$route.params.user_id + '/follow',{
                        method:'GET',
                        headers:{
                            'X-CSRFToken' : token,
                            'Authorization': 'Bearer '  + localStorage.getItem('token')
                        },
                        credentials:'same-origin'
                    })
                    .then(function(response){
                        return response.json();
                    })
                    .then(function(jsonResonse){
                        //console.log(jsonResonse)
                        if (jsonResponse.response){
                            alert("User Followed!");
                            document.getElementById('followers').innerHTML=updatefollows;
                            document.getElementById('follow').disabled=true;
                            document.getElementById('follow').classList.remove('btn-primary');
                            document.getElementById('follow').classList.add('btn-success');
                        }
                    })
                }
            })
        }
    },
    created: function(){
            let self = this;
            this.token = localStorage.getItem('token');
            let current_user = localStorage.getItem('current_user')
            fetch('/api/users/' + this.$route.params.current_user,{
                method:'GET',
                body:{},
                headers:{
                    'X-CSRFToken' : token,
                    'Authorization': 'Bearer '  + localStorage.getItem('token')
                },
                credentials:'same-origin'
            })
            .then(function(response){
                return response.json();
            })
            .then(function(jsonResponse){
                if (jsonResponse.response){
                    self.posts=jsonResponse.response['0']['posts']['0'];
                    self.rows=Math.ceil((self.posts.length/self.columns));
                    self.numposts=jsonResponse.response['0']['postamt'];
                    self.follows=jsonResponse.response['0']['follows'];
                    self.data=jsonResponse.response['0']['data'];
                    if((jsonResponse.response['0']['current']==='No' &&  jsonResponse.response['0']['following']==='No')===true){
                        self.toshow='Yes';
                    }
                    if(jsonResponse.response['0']['current']==='No' && jsonResponse.response['0']['following']==='Yes'){
                            self.isfollowing='You already follow '+self.data['username'];
                    }
                }
                else{
                        self.error=jsonResponse.error['error'];
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
},
    data:function(){
    return {
            token: token, 
            posts: [],
            follows:0,
            postamt:0,
            data:[],
            isfollowing:'',
            error:'',
            toshow:'',
            columns:3,
            rows:0
            
    }
  }  
});

const Logout = Vue.component("logout", {
  template: `
  <div>
  <div/>`,
  created: function(){
    const self = this;
    
    fetch("api/auth/logout", {
      method: "GET"
    }).then(function(response){
      return response.json();
    }).then(function(jsonResponse){
      localStorage.removeItem("current_user");
      router.go();
      router.push("/");
    }).catch(function(error){
      console.log(error);
    });
  }
});



const router = new VueRouter({
 mode: 'history',
 routes: [
    { path: '/', component: Home },
    { path: '/register', component: Register }, 
    { path: '/login', component: Login},
    { path: '/explore', component: Explore},
    {path: "/users/:user_id", component: MyProfile},
    { path: "/posts/new", component: NewPost},
    {path: "/logout", component: Logout}
 ]
});


const app = new Vue({
 el: '#app',
 router
});


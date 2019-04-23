/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
        <header>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
              <a class="navbar-brand" href="#">VueJS App</a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>

              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <router-link to="/" class="nav-link">Home</router-link>
                    </li>
                    <li class="nav-item active">
                        <router-link to="/register" class="nav-link">Register</router-link>
                    </li>
                    <li class="nav-item active">
                        <router-link to="/login" class="nav-link">Login</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/logout" class="nav-link">Logout</router-link>
                    </li>
                    <li class="nav-item active">
                        <router-link to="/explore" class="nav-link">Explore</router-link>
                    </li>

                    <li class="nav-item">
                        <router-link to="/posts/new" class="nav-link">New Posts</router-link>
                    </li>
                </ul>
              </div>
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
     <div class="home">
        <div class="grid-container">
            <div>
                <img src="/static/images/Coffee.jpeg" alt="Photogram Logo" height="367" width="350" class="Img"> 
            </div>
            <div>
                <div class = "centre"> 
                    <h1 class="page-header"> {{ welcome }} <span class="glyphicon glyphicon-camera"></span> </h1> 
                    </div>
                <hr>
                
                <p class="lead"> {{ photogram_body1 }} <br/> {{photogram_body2 }} </p>
                
                <div class = "grid-contain"> 
                    <button type="button" class="btn btn-success">Register</button>
                    <button type="button" class="btn btn-info">Login</button>
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

});

const NewsList = Vue.component('news-list', {
    template: `
        
        <div class="news"> 
                <h2>News</h2>
                
                <div class="form-inline d-flex justify-content-center">
            <div class="form-group mx-sm-3 mb-2">
                <label class="sr-only" for="search">Search</label>
                <input type="search" name="search" v-model="searchTerm" id="search" class="form-control mb-2 mr-sm-2" placeholder="Enter search term here" />
                <button class="btn btn-primary mb-2" @click="searchNews">Search</button>
            </div>
        </div>
                 <div class = "grid-container">
                    <li v-for="article in articles" class="news__item" id = "item">
                        <div>
                            <div id="title">
                            <strong> {{ article.title }} </strong>  
                            </div>
                            <br>
                           
                            <img :src="article.urlToImage" height="150" width="250" class = "newsImg"/>
                            <br>
                        
                            {{ article.description }} 
                        
                        </div>
                    </li> 
                </div>
            </div>
            
            
            
    `,
    created: function() {
        let self = this;
        fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey= ').then(function(response) {
                return response.json();
            }).then(function(data) {
                console.log(data);
                self.articles = data.articles;
            });
    },
    data: function() {
        return {
            articles: [],
            searchTerm: '' 
            }
    },
    methods: {
     searchNews: function() {
        let self = this;
        fetch('https://newsapi.org/v2/everything?q='+ self.searchTerm + '&language=en&apiKey=<your-api-key>')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            self.articles = data.articles;
        });
     }
    } 
});



const router = new VueRouter({
 mode: 'history',
 routes: [
    { path: '/', component: Home },
    { path: '/register', component: Register }
 ]
});


const app = new Vue({
 el: '#app',
 router
});


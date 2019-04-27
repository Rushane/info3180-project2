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
                    <li class="nav-item">
                        <router-link to="/news" class="nav-link">News</router-link>
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

const Login = Vue.component('login', {

});


const router = new VueRouter({
 mode: 'history',
 routes: [
    { path: '/', component: Home },
    { path: '/register', component: Register }, 
    { path: '/login', component: Login}
 ]
});


const app = new Vue({
 el: '#app',
 router
});


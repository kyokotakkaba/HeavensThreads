var myApp = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'Heavens Threads',
  // App id
  id: 'com.rurumustudio.heavensthreads',

  navbar: {
    mdCenterTitle: true,
  },

  // Enable swipe panel
  // panel: {
  //   swipe: 'left',
  // },
  // Add default routes
  routes: [
    {
      path: '/welcome/',
      url: 'pages/welcome/welcome.html',
    },
    {
      path: '/login/',
      url: 'pages/welcome/login.html',
    },
    {
      path: '/register/',
      url: 'pages/welcome/register.html',
    },
    {
      path: '/home/',
      url: 'pages/home.html',
    },
    {
      path: '/content/',
      url: 'pages/content.html',
    },
  ],
  // ... other parameters
});

var mainView = myApp.views.create('.view-main');


var $$ = Dom7;
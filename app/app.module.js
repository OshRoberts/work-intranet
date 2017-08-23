
var libraryAppModule = angular.module('capgeminiNewcastleApp', ['ngRoute', 'ngStorage', 'ngAnimate', 'ui.bootstrap', 'ngMessages', 'angularModalService', 'as.sortable' ])
    .config(function ($routeProvider, $locationProvider) {
        console.log('capgeminiNewcastleApp config');

        $locationProvider.hashPrefix('');
        $routeProvider
            .when('/login', {
                templateUrl: '/login/login.html',
                controller: 'LoginCtrl'
            })
            .when('/passwordReset', {
                templateUrl: '/passwordReset/passwordReset.html',
                controller: 'PasswordResetCtrl'
            })
            // .when('/requestAccess', {
            //     templateUrl: '/requestAccess/requestAccess.html',
            //     controller: 'RequestAccessCtrl'
            // })
            .when('/calendar', {
                templateUrl: '/calendar/calendar.html',
                controller: 'CalendarCtrl'
            })
            .when('/calendar/:firstIndic', {
                templateUrl: '/calendar/calendar.html',
                controller: 'CalendarCtrl'
            })
            .when('/allUsersLeave', {
                templateUrl: '/calendar/allUsersLeave.html',
                controller: 'CalendarCtrl'
            })
            .when('/metrics', {
                templateUrl: '/metrics/metrics.html',
                controller: 'MetricsCtrl'
            })
            .when('/profile', {
                templateUrl: '/profile/profile.html',
                controller: 'ProfileCtrl'
            })
            .when('/userAdmin', {
                templateUrl: '/userAdmin/userAdmin.html',
                controller: 'UserAdminCtrl'
            })
            .when('/documentation', {
                templateUrl: '/documentation/documentation.html',
                controller: 'DocumentationCtrl'
            })
            .when('/contacts', {
                templateUrl: '/contacts/contacts.html',
                controller: 'ContactsCtrl'
            })


            .when('/registration', {
                templateUrl: '/registration/register.html',
                controller: 'RegisterCtrl'
            })

            .when('/', {
                templateUrl: '/views/home.html'
            });
    })
                
                
                    
    // .service('userDetailsService',function(){

    //     var cache;

    //     this.saveData = function(data){
    //         cache = data;
    //     };

    //     this.retrieveData = function(){
    //         return cache;
    //     };

    // })
    
    .run(function($rootScope) {
        $rootScope.userDetails = '';
    })
;

                
                
                
                
                
       
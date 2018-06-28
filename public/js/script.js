var app = angular.module('myapp', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'mainController'
        })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'signupController'
       })
        .when('/homepage', {
            templateUrl: 'views/homepage.html',
            controller: 'homepageController',
            resolve: ['checkurl', function (checkurl) {
                return checkurl.validateurl();
            }]

        })
        .when('/postajobpage', {
            templateUrl: 'views/postajobpage.html',
            controller: 'postajobpageController',
            resolve: ['checkurl', function (checkurl) {
                return checkurl.validateurl();
            }]
        })
        .when('/searchjob', {
            templateUrl: 'views/searchjobspage.html',
            controller: 'searchjobpageController',
            resolve: ['checkurl', function (checkurl) {
                return checkurl.validateurl();
            }]
        }).otherwise('/', {
            templateUrl: 'views/main.html'

        })
});

//So that the user stays on refresh
app.service('loginservice', function ($http, $location, $rootScope) {
    var service = {};

    service.isLoggedIn = function () {

        $http.post('http://localhost:8000/getUser').then(function (data) {//userdata and flag
            console.log(data);//this results will have a lot of stuff($http req etc.)!!
            if (data) {
                //    var d1=data.data;
                //    console.log('Data found:',d1);
                //    $scope.d1.data.usertype=usertype;
                $rootScope.userdata = data.data.data;
                $rootScope.usertype = data.data.data.usertype;
                $rootScope.username = data.data.data.username;
                console.log('In service');
                console.log($rootScope.username);


            } else {
                console.log('error');
            }
        });

    }
    console.log(service);
    return service;


});

//for resolving direct url access issues
app.factory('checkurl', function ($http, $location, $q, $rootScope, loginservice) {//$q promise - in angular
    return {
        validateurl: function () {
            var promise = $q.defer();
            loginservice.isLoggedIn();
 console.log($rootScope.username);
            if (!$rootScope.userdata) {
                console.log('reject');
                promise.reject('Invalid User');
            }
             else 
            {
                console.log('resolve');
                promise.resolve($rootScope.userdata);
                console.log($rootScope.userdata);
            }
            return promise.promise;
        }
    }

});


app.controller('mainController', function ($scope, $http, $location, checkurl, $rootScope, loginservice) {
    //  loginservice.isLoggedIn();

    $scope.submit = function (user) {
        console.log(user);


        $http.post('http://localhost:8000/login', user).then(function (res) {

            console.log(res.data.success);
            if (!res.data.success) {
                alert('invalid Details');
                $location.path('/');

            } else {
           
                $location.path('/homepage');
                // window.location.reload();
            }

            // window.location.reload();
            loginservice.isLoggedIn();
            console.log($rootScope.userdata);

        })
    }
    $scope.signup = function () {
        $location.path('/signup');
    }
});


app.controller('signupController', function ($scope, $location, $rootScope, $http, loginservice) {
    $scope.Register = function (newUser) {
        console.log(newUser);
        $http.post('http://localhost:8000/createuser', $scope.newUser).then(function (res) {//whatever we are sending pass as 2nd argument!
            console.log(res.data);

        })

        $location.path('/');
        // window.location.reload();
        // driver.navigate().refresh();
        // browser.refresh();
    }
    // window.location.reload();

});



app.controller('homepageController', function ($scope, $location, $rootScope, loginservice, $http) {

    // loginservice.isLoggedIn();
    // $scope.username=$rootScope.username;
    // $scope.usertype=$rootScope.usertype;
    // console.log($scope.usertype);

    loginservice.isLoggedIn();
   console.log($rootScope.username)


    $scope.logout = function () {
        // $scope.user=username;
        console.log($scope.username);
        console.log($scope.userdata);

        //    loginservice.isLoggedIn();

        $http.put('http://localhost:8000/logout', $scope.userdata).then(function (res) {
            // loginservice.isLoggedIn();
        
            console.log(res);

            $location.path('/');
        })
    };


    // $scope.usertype=usertype;
    // $scope.u=data.data.data;
    // loginservice.isLoggedIn($scope.u);
     
        $scope.postjob = function () {
            // window.location.reload();
            $location.path('/postajobpage');
        };
    
   
        $scope.searchjob = function () {
            $location.path('/searchjob');
        };
   
});

app.controller('postajobpageController', function ($scope, $location, $rootScope, $http) {

    $scope.savejob = function (newUser) {
        console.log(newUser);
        $http.post('http://localhost:8000/postjob', $scope.newUser).then(function (res) {//whatever we are sending pass as 2nd argument!
            console.log(res.data);
        })
        $location.path('/homepage');
    }

});


app.controller('searchjobpageController', function ($scope, $location, $rootScope, $http) {

    $scope.search = function (newUser) {

        $http.post('http://localhost:8000/post', newUser).then(function (res) {
            console.log(res.data);

            if (res.data.success == true) { 
                for (i in res.data) {

                    $rootScope.jobdetails = res.data[i];


                }
            } else {
                alert('No match Found!!');

            }
        })
    }

    // $scope.logout = function () {
    //     $location.path('/');

    // }
    $scope.reset = function (newUser) {
        $scope.newUser.searchbytitle = '';
        $scope.newUser.keywords = '';
        $scope.newUser.location ='';
        document.getElementById('disp').innerHTML = "";

    }
});
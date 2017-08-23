
angular.module('capgeminiNewcastleApp')

    .controller('LoginCtrl', function($scope, $rootScope, $location, ApplicationSvc) {

        $scope.submit = function() {
            console.log ('LoginCtrl: ' + $scope.email);

            ApplicationSvc.login($scope.email, $scope.password)
                .then(
                    (res) => {
                        if (res.data.message === 'LOGIN_SUCCESSFUL') {
                            
                            //userDetailsService.saveData(res.data.user);
                            $rootScope.userDetails = res.data.user;

                            // $location.path('/calendar/first');
                            $location.path('/');

                            //$scope.$storage = res.data.user.firstname;
                            // $scope.$storage = $localStorage.$default({
                            //     firstname: res.data.user.firstname
                            // });


                        } else {
                            $scope.password = '';
                            $location.path('/login');
                        }
                    },
                    (err) => {
                        console.log('Something went wrong: ', err.data.message);
                    }
                );


// ##############################  Metrics ##############################
// currently on login, but will need some method of reloading every hour???!?!

            // default colors - assigned in admin.js

            ApplicationSvc.metricsIncidentsOpenGet()
                .then(
                    (res) => {
                        if (res.data.message === 'GET_SUCCESSFUL') {

                            // $rootScope.labelsChart1 = ['CRU', 'EHRT', 'PSOD'];
                            $rootScope.labelsChart1 = res.data.labelsChart1;
                            $rootScope.datasetsChart1 = [{
                                label: '# of Incidents',
                                // data: [2, 3, 1],
                                data: res.data.dataChart1,
                                backgroundColor: res.data.backgroundColorChart1,
                                borderColor: res.data.borderColorChart1,
                                borderWidth: 1
                            }];

                        } else if (res.data.message === 'NO_OPEN_INCIDENTS'){
                            // no current open incidents
                            $rootScope.labelsChart1 = {};
                            $rootScope.datasetsChart1 = [{
                                label: '# of Incidents',
                                // data: [2, 3, 1],
                                data: {},
                                backgroundColor: {},
                                borderColor: {},
                                borderWidth: 1
                            }];
                        } else {
                           // $location.path('/login');
                        }
                    },
                    (err) => {
                        console.log('Something went wrong: ', err.data.message);
                    }
                );   



            ApplicationSvc.metricsIncidentsRaisedThisSMPGet()
                .then(
                    (res) => {
                        if (res.data.message === 'GET_SUCCESSFUL') {

                            $rootScope.labelsChart3 = res.data.labelsChart3;
                            $rootScope.datasetsChart3 = [{
                                label: '# of Incidents Raised',
                                data: res.data.dataChart3,
                                backgroundColor: res.data.backgroundColorChart3,
                                borderColor: res.data.borderColorChart3,
                                borderWidth: 1
                            }];

                        } else if (res.data.message === 'NO_RAISED_INCIDENTS'){
                            // no current open incidents
                            $rootScope.labelsChart3 = {};
                            $rootScope.datasetsChart3 = [{
                                label: '# of Incidents Raised',
                                // data: [2, 3, 1],
                                data: {},
                                backgroundColor: {},
                                borderColor: {},
                                borderWidth: 1
                            }];
                        } else {
                        //    $location.path('/login');
                        }
                    },
                    (err) => {
                        console.log('Something went wrong: ', err.data.message);
                    }
                );   



            ApplicationSvc.metricsDataLastUpdatedGet()
                .then(
                    (res) => {
                        if (res.data.message === 'GET_SUCCESSFUL') {

                            $rootScope.metricsDataLastUpdated = res.data.metricsDataLastUpdated;
                            $rootScope.currentSMP = res.data.currentSMP;

                        } else {
                          //  $location.path('/login');
                        }
                    },
                    (err) => {
                        console.log('Something went wrong: ', err.data.message);
                    }
                ); 



            ApplicationSvc.metricsProblemsOpenGet()
                .then(
                    (res) => {
                        if (res.data.message === 'GET_SUCCESSFUL') {

                            // $rootScope.labelsChart1 = ['CRU', 'EHRT', 'PSOD'];
                            $rootScope.labelsChart2 = res.data.labelsChart2;
                            $rootScope.datasetsChart2 = [{
                                label: '# of Problems',
                                // data: [2, 3, 1],
                                data: res.data.dataChart2,
                                backgroundColor: res.data.backgroundColorChart2,
                                borderColor: res.data.borderColorChart2,
                                borderWidth: 1
                            }];

                        } else if (res.data.message === 'NO_OPEN_PROBLEMS'){
                            // no current open incidents
                            $rootScope.labelsChart2 = {};
                            $rootScope.datasetsChart2 = [{
                                label: '# of Problems',
                                // data: [2, 3, 1],
                                data: {},
                                backgroundColor: {},
                                borderColor: {},
                                borderWidth: 1
                            }];
                        } else {
                           // $location.path('/login');
                        }
                    },
                    (err) => {
                        console.log('Something went wrong: ', err.data.message);
                    }
                );




            ApplicationSvc.metricsProblemsRaisedThisSMPGet()
                .then(
                    (res) => {
                        if (res.data.message === 'GET_SUCCESSFUL') {

                            $rootScope.labelsChart4 = res.data.labelsChart4;
                            $rootScope.datasetsChart4 = [{
                                label: '# of Problems Raised',
                                data: res.data.dataChart4,
                                backgroundColor: res.data.backgroundColorChart4,
                                borderColor: res.data.borderColorChart4,
                                borderWidth: 1
                            }];

                        } else if (res.data.message === 'NO_RAISED_PROBLEMS'){
                            // no current open problems
                            $rootScope.labelsChart4 = {};
                            $rootScope.datasetsChart4 = [{
                                label: '# of Problems Raised',
                                // data: [2, 3, 1],
                                data: {},
                                backgroundColor: {},
                                borderColor: {},
                                borderWidth: 1
                            }];
                        } else {
                        //    $location.path('/login');
                        }
                    },
                    (err) => {
                        console.log('Something went wrong: ', err.data.message);
                    }
                ); 



            ApplicationSvc.metricsUserActivityIncidentsGet()
                .then(
                    (res) => {
                        if (res.data.message === 'GET_SUCCESSFUL') {

                            $rootScope.userClosedMostIncidentsThisSMP = res.data.userClosedMostIncidentsThisSMP;
                            $rootScope.userClosedMostIncidentsThisSMPCount = res.data.userClosedMostIncidentsThisSMPCount;
                            $rootScope.userClosedMostIncidentsThisYear = res.data.userClosedMostIncidentsThisYear;
                            $rootScope.userClosedMostIncidentsThisYearCount = res.data.userClosedMostIncidentsThisYearCount;
                            $rootScope.usersClosedMostIncidentsAllTime = res.data.usersClosedMostIncidentsAllTime;
                            $rootScope.closedIncidentsTotalCount = res.data.closedIncidentsTotalCount;
                            

                        } else {
                          //  $location.path('/login');
                        }
                    },
                    (err) => {
                        console.log('Something went wrong: ', err.data.message);
                    }
                ); 



        };
    })
    



    





    
    .controller('LogoutCtrl', function($scope, $rootScope, $location, ApplicationSvc) {

        $scope.submit = function() {
            console.log ('LogoutCtrl: ');

            $rootScope.userDetails = null;
            toastr.error('ADMIN MESSAGE:<br>' + 'Adios amigo!');    
            $location.path('/');                                   
        };
    });

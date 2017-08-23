
angular.module('capgeminiNewcastleApp')

    .controller('HeaderCtrl', function($scope, $http, $rootScope, $location, $window, ApplicationSvc) {

        //$scope.userDetails = $rootScope.userDetails;
        //$scope.userDetails = {firstname:'weee'};

        $scope.refreshingIndic = false;

        $rootScope.$watch('userDetails', function() {
                $scope.userDetails = $rootScope.userDetails;
            });


        
        $scope.mainMenuSelected= function(selectedMenu){
            if (selectedMenu === 'LEAVE'){
                $location.path('/calendar/first');

            }else if(selectedMenu === 'DTX'){
                $window.open('http://missbhadtx03.uki.capgemini.com/DTX.NET/Login.aspx', '_blank');

            }else if(selectedMenu === 'DOCUMENTATION'){
                $location.path('/documentation');

            }else if(selectedMenu === 'CONTACTS'){
                $location.path('/contacts');

            }else if(selectedMenu === 'METRICS'){
                $location.path('/metrics');

            }else if(selectedMenu === 'PROFILE'){
                $location.path('/profile');

            }else if(selectedMenu === 'USERADMIN'){
                $location.path('/userAdmin');
            }
        };


        $scope.logMeOut = function() {
            $rootScope.userDetails = null;
            toastr.info('ADMIN MESSAGE:<br>' + 'Adios amigo!');    
            $location.path('/');
        };





// ################################################################################
// temp functionality call - code will still be used but called by some kind of 
// batch scheduler, every hour on the hour!
// ################################################################################

        $scope.refreshIncidentData = function(){

            $scope.refreshingIndic = !$scope.refreshingIndic;

            ApplicationSvc.ImportFromTicketHandlingSpreadsheet()
                .then(
                    (res) => {
                        if (res.data.message === 'INCIDENT_DATA_REFRESH_SUCCESSFUL') {

                            repopulateScopeVariables();  
                            toastr.success('ADMIN MESSAGE:<br>' + 'Incident Data Refreshed!');  
                        } else {
                            toastr.error('ADMIN MESSAGE:<br>' + 'Incident Data Refresh - FAILED!' );     
                        }
            
                        $scope.refreshingIndic = false;

                    },
                    (err) => {
                        console.log('Something went wrong: ', err.data.message);
                    }
                );  
        };






function repopulateScopeVariables(){
    
            // ############################################################
            // call to repopulate scope variables to hold latest metric data

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
}







    });
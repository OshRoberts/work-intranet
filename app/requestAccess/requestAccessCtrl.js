
angular.module('capgeminiNewcastleApp')

            .controller('RequestAccessCtrl', function($scope, $rootScope, $location, ApplicationSvc) {
        
                $scope.submit = function() {
                    console.log ('RequestAccessCtrl: ' + $scope.email);

                    ApplicationSvc.requestAccess($scope.email, $scope.firstname, $scope.surname)
                        .then(
                            (res) => {
                                if (res.data.message === 'REQUESTACCESS_CHECK_SUCCESSFUL') {
                                    
                                    //user doesn't exist in db

                                    // TODO: save user to db!! <-- need to decide on db fields 

                                    // TODO: now need to send an email here!!

                                    $location.path('/');

                                } else {
                                    $scope.email = '';
                                    $location.path('/requestAccess');
                                }
                            },
                            (err) => {
                                console.log('Something went wrong: ', err.data.message);
                            }
                        );
                };
            });
            
                
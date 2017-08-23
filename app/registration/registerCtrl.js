
angular.module('capgeminiNewcastleApp')

                .controller('RegisterCtrl', function($scope, $location, ApplicationSvc) {
                    
                    $scope.submit = function() {
                        console.log ('RegisterCtrl: ' + $scope.email);

                        if ( $scope.password === $scope.password_confirm) {

                            ApplicationSvc.register($scope.email, $scope.password, $scope.firstname, $scope.surname)
                                .then(
                                    (res) => {
                                        if (res.data.message === 'REGISTRATION_SUCCESSFUL') {
                                            $location.path('/calendar');
                                        } else {
                                            $scope.password = '';
                                            $scope.password_confirm = '';
                                            $location.path('/register');
                                        }
                                    },
                                    (err) => {
                                        console.log('Something went wrong - RegisterCtrl: ', err.data.message);
                                    }
                                );
                        } else {
                            toastr.error('ADMIN MESSAGE: <br>' + 'Passwords do not match');
                            $scope.password_confirm = '';
                            $location.path('/register');

                        }
                    };
                });
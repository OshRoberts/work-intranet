
angular.module('capgeminiNewcastleApp')

            .controller('PasswordResetCtrl', function($scope, $http, $rootScope, $location, ApplicationSvc) {
                
                $scope.email = '';

                $scope.submit = function() {
                        console.log ('LoginCtrl: ' + $scope.email);

                        ApplicationSvc.passwordReset($scope.email)
                            .then(
                                (res) => {
                                    if (res.data.message === 'RESET_SUCCESSFUL') {
                                        
                                        // email sent to user to reset password
                                        $location.path('/');

                                    } else if (res.data.message === 'EMAIL_NOT_FOUND') {
                                        $location.path('/passwordReset');
                                    }
                                    else {
                                        $location.path('/');
                                    }
                                },
                                (err) => {
                                    console.log('Something went wrong: ', err.data.message);
                                }
                            );
                    };
            });
            

// password reset


// account: capgeminiNE@gmail.com
// pwd: Cg6X3Lg@5#!1


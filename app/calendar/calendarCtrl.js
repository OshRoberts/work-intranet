
angular.module('capgeminiNewcastleApp')

            .controller('CalendarCtrl', function($scope, $rootScope, $location) {
                                
                //$scope.userDetails = userDetailsService.retrieveData();
                if ( $rootScope.userDetails ){
                    $scope.userDetails = $rootScope.userDetails;
                }else{
                    // not signed in!
                    $location.path('/');
                }
                


            });
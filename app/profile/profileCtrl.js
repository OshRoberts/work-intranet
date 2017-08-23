
angular.module('capgeminiNewcastleApp')

        .controller('ProfileCtrl', function($scope, $rootScope, $location, ApplicationSvc) {
                            
            //$scope.userDetails = userDetailsService.retrieveData();
            if ( $rootScope.userDetails ){
                $scope.userDetails = $rootScope.userDetails;
            }else{
                // not signed in!
                $location.path('/login');
            }


            ApplicationSvc.profileGet($scope.userDetails.workEmail)
                .then(
                    (res) => {
                        if (res.data.message === 'GET_SUCCESSFUL') {
                            $scope.userProfile = res.data.user;

                            // blank all zero phone numbers 
                            $scope.userProfile.workTel = replaceZeroPhoneNumbers($scope.userProfile.workTel);
                            $scope.userProfile.workMobile = replaceZeroPhoneNumbers($scope.userProfile.workMobile);
                            $scope.userProfile.homeTel = replaceZeroPhoneNumbers($scope.userProfile.homeTel);
                            $scope.userProfile.homeMobile = replaceZeroPhoneNumbers($scope.userProfile.homeMobile);
                            $scope.userProfile.emergencyContactTel = replaceZeroPhoneNumbers($scope.userProfile.emergencyContactTel);

                        } else {
                            $location.path('/login');
                        }
                    },
                    (err) => {
                        console.log('Something went wrong: ', err.data.message);
                    }
                );   




        $scope.checkQuota = function(profileForm){
        
            if ( $scope.userProfile.leaveQuota < 10 || $scope.userProfile.leaveQuota > 50 ){
                profileForm.leaveQuota.$error.leaveQuotaRangeError = true;
                profileForm.$invalid = true;
            } else {
                // no error
                profileForm.leaveQuota.$error.leaveQuotaRangeError = false;
                profileForm.leaveQuota.$invalid = false;
            }
        };









                
        $scope.submit = function() {
            console.log ('ProfileCtrl: ');

            // check leave Quota validates, since it is a bespoke validation - maybe???

            

// var is = require( 'validator.js' ).Assert;
// var validator = require( 'validator.js' ).validator();

// var object = {
//     name: 'john doe',
//     email: 'wrong@email',
//     firstName: null,
//     phone: null
//   },
//   constraint = {
//     name: [ is.notBlank(), is.ofLength( { min: 4, max: 25 } ) ],
//     email: is.email(),
//     firstName: is.notBlank(),
//     phone: is.notBlank()
//   };

// validator.validate( object, constraint );

// need to clean and check all inputs for dodgyness!
        // var safeIndic = true;
        // if ( validator.isEmail($scope.userProfile.workEmail) === false ){
        //     safeIndic = false;
        // }
        // if ( validator.isAlphanumeric($scope.userProfile.firstname, 'en-GB') === false ){
        //     safeIndic = false;
        //     $scope.profileForm.firstname.$setValidity('maxLength', $scope.userProfile.firstname<13);
        // }




                ApplicationSvc.profileUpdate($scope.userProfile)
                    .then(
                        (res) => {

                            if (res.data.message === 'EMAIL_ALREADY_USED') {
                                // $scope.userProfile.workEmail.$invalid = true;
                                $location.path('/profile');

                            } else if (res.data.message === 'SAVE_SUCCESSFUL') {
                                
                                // update $rootScope with any changes
                                $rootScope.userDetails = $scope.userProfile;
                                // update $scope with any changes
                                $scope.userDetails = $rootScope.userDetails;

                                $location.path('/');

                            } else if (res.data.message === 'VALIDATION_ERROR') {
                                // inputs failed validation/sanitization check
                                // TODO - need to mark/ identify fields
                                
                            } else {
                                $location.path('/');
                            }
                        },
                        (err) => {
                            console.log('Something went wrong: ', err.data.message);
                        }
                    );
            };

        });





function replaceZeroPhoneNumbers(telNumber){
    if ( telNumber === '0' ){
        telNumber = '';
    }
    return telNumber;
}







angular.module('capgeminiNewcastleApp')

        .controller('UserAdminCtrl', function($scope, $rootScope, $location, ApplicationSvc) {
                            
            //$scope.userDetails = userDetailsService.retrieveData();
            if ( $rootScope.userDetails ){
                $scope.userDetails = $rootScope.userDetails;
            }else{
                // not signed in!
                $location.path('/');
            }



            ApplicationSvc.userAdminGet()
                .then(
                    (res) => {
                        if (res.data.message === 'GET_SUCCESSFUL') {
                            $scope.allUsers = res.data.allUsers;

                            // loop thru array
                            var arrayLength = $scope.allUsers.length;
                            for (var i = 0; i < arrayLength; i++) {
                                if ($scope.allUsers[i].isActive === true){
                                    $scope.allUsers[i].name = $scope.allUsers[i].firstname + ' ' + $scope.allUsers[i].surname;
                                } else {
                                    $scope.allUsers[i].name = $scope.allUsers[i].firstname + ' ' + $scope.allUsers[i].surname + ' (not Active)';
                                }
                                
                                // blank all zero phone numbers 
                                $scope.allUsers[i].workTel = replaceZeroPhoneNumbers($scope.allUsers[i].workTel);
                                $scope.allUsers[i].workMobile = replaceZeroPhoneNumbers($scope.allUsers[i].workMobile);
                                $scope.allUsers[i].homeTel = replaceZeroPhoneNumbers($scope.allUsers[i].homeTel);
                                $scope.allUsers[i].homeMobile = replaceZeroPhoneNumbers($scope.allUsers[i].homeMobile);
                                $scope.allUsers[i].emergencyContactTel = replaceZeroPhoneNumbers($scope.allUsers[i].emergencyContactTel);
                                
                            }
                            $scope.allUsers.unshift({'name': '>> Add a New User <<'});
                            //$scope.allUsers.unshift({'name': 'Please Select a User'});
                            $scope.showInputsHolder = false;
                        } else {
                            $location.path('/login');
                        }
                    },
                    (err) => {
                        console.log('Something went wrong: ', err.data.message);
                    }
                );

                

            $scope.userSelected = function(selectedUser){

                if (selectedUser === null){
                    //$scope.selectedUser.id = '';
                    $scope.selectedUser = null;

                    $scope.showInputsHolderClass = 'animated fadeOut';
                    $scope.showInputsHolder = false;

                } else if (selectedUser.name === '>> Add a New User <<'){
                    //$scope.selectedUser.id = '';
                    $scope.selectedUser.newUserIndic = true;

                    $scope.selectedUser.firstname = null;
                    $scope.selectedUser.surname = null;
                    $scope.selectedUser.workEmail = null;
                    $scope.selectedUser.workTel = null;
                    $scope.selectedUser.workMobile = null;
                    $scope.selectedUser.userLevel = null;
                    $scope.selectedUser.documentsEditor = null;
                    $scope.selectedUser.leaveQuota = null;
                    $scope.selectedUser.isActive = true;
                    
                    $scope.selectedUser.homeEmail = null;
                    $scope.selectedUser.homeTel = null;
                    $scope.selectedUser.homeMobile = null;
                    $scope.selectedUser.homeAddress1 = null;
                    $scope.selectedUser.homeAddress2 = null;
                    $scope.selectedUser.homeAddress3 = null;
                    $scope.selectedUser.homeAddress4 = null;
                    $scope.selectedUser.homePostcode = null;
                    $scope.selectedUser.emergencyContactName = null;
                    $scope.selectedUser.emergencyContactTel = null;

                    $scope.showInputsHolderClass = 'animated fadeIn';
                    $scope.showInputsHolder = true;
                    
                } else {
                    $scope.selectedUser.newUserIndic = false;

                    $scope.showInputsHolderClass = 'animated fadeIn';
                    $scope.showInputsHolder = true;
                }
                
            };



            $scope.checkQuota = function(userAdminForm){
            
                if ( $scope.selectedUser.leaveQuota < 10 || $scope.selectedUser.leaveQuota > 50 ){
                    userAdminForm.leaveQuota.$error.leaveQuotaRangeError = true;
                    userAdminForm.$invalid = true;
                } else {
                    // no error
                    userAdminForm.leaveQuota.$error.leaveQuotaRangeError = false;
                    userAdminForm.leaveQuota.$invalid = false;
                }
            };

             

            $scope.submit = function() {
                console.log ('UserAdminCtrl: ');

                // check leave Quota validates, since it is a bespoke validation - maybe???

                ApplicationSvc.userAdminUpdate($scope.selectedUser)
                    .then(
                        (res) => {

                            if (res.data.message === 'EMAIL_ALREADY_USED') {
                                $location.path('/userAdmin');

                            } else if (res.data.message === 'SAVE_SUCCESSFUL') {
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




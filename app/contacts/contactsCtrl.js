
angular.module('capgeminiNewcastleApp')

    .controller('ContactsCtrl', function($scope, $http, $rootScope, $location, $window, ApplicationSvc) {

        //$scope.userDetails = $rootScope.userDetails;
        //$scope.userDetails = {firstname:'weee'};

        $rootScope.$watch('userDetails', function() {
            $scope.userDetails = $rootScope.userDetails;
        });

        // use to set default tab to be visible
        $scope.tab = 1;
        // indic to show edit documents popup
        $scope.showPopup = false;


        ApplicationSvc.getContactsMenu()
            .then(
                (res) => {
                    if (res.data.message === 'GET_SUCCESSFUL') {
                        $scope.contactsMenuList = res.data.contactsMenuList;

                        var vm = this;
                        vm.contactsMenuList = $scope.contactsMenuList;
                        //$scope.showInputsHolder = false;
                    } else {
                        $location.path('/login');
                    }
                },
                (err) => {
                    console.log('Something went wrong: ', err.data.message);
                }
            );



        ApplicationSvc.getContactsSections()
            .then(
                (res) => {
                    if (res.data.message === 'GET_SUCCESSFUL') {
                        $scope.contactsSectionsList = res.data.contactsSectionsList;

                        var vs = this;
                        vs.contactsSectionsList = $scope.contactsSectionsList;
                        
                        // loop thru array
                        // var arrayLength = vs.contactsSectionsList.length;
                        // for (var i = 0; i < arrayLength; i++) {
                        //     if ( vs.contactsSectionsList[i].sectionOrder === 1 ) {
                        //         vs.contactsSectionsList[i].isActive = true;
                        //     } else {
                        //         vs.contactsSectionsList[i].isActive = false;
                        //     }
                        // }
                        // // $scope.isActive = 1;
                        // $scope.contactsSectionsList = vs.contactsSectionsList;

                    } else {
                        $location.path('/login');
                    }
                },
                (err) => {
                    console.log('Something went wrong: ', err.data.message);
                }
            );
            
            
            
            
        ApplicationSvc.getContactsItems()
            .then(
                (res) => {
                    if (res.data.message === 'GET_SUCCESSFUL') {
                        $scope.contactsItemsList = res.data.contactsItemsList;

                        // loop thru array
                        var arrayLength = $scope.contactsItemsList.length;
                        for (var i = 0; i < arrayLength; i++) {
                            
                            // blank all zero phone numbers 
                            $scope.contactsItemsList[i].workTel = replaceZeroPhoneNumbers($scope.contactsItemsList[i].workTel);
                            $scope.contactsItemsList[i].workMobile = replaceZeroPhoneNumbers($scope.contactsItemsList[i].workMobile);

                            // indicate if email is too long for display box
                            if ( $scope.contactsItemsList[i].workEmail.length > 28 ) {
                                $scope.contactsItemsList[i].longEmail = true;
                            } else {
                                $scope.contactsItemsList[i].longEmail = false;
                            }
                        }

                    } else {
                        $location.path('/login');
                    }
                },
                (err) => {
                    console.log('Something went wrong: ', err.data.message);
                }
            );




// $scope.tabs = [
//     { title:'Longbenton', content:'Dynamic content 1' },
//     { title:'North East Community', content:'more people to go here....' },
//     { title:'HR & Finance', content:'stuff content 1' },
//     { title:'LEAN', content:'Dynamic content 2', disabled: false }
//   ];





        $scope.hoverIn = function(){
            this.hoverShow = true;
        };

        $scope.hoverOut = function(){
            this.hoverShow = false;
        };



        $scope.editSections = function(){


        };   


        $scope.editDocuments = function(){
            //return $scope.tab === this;
        };






        $scope.showEditContactsPopup = function(){
            $scope.hover = !$scope.hover;
            $scope.showPopup = !$scope.showPopup;
        };

    });








function replaceZeroPhoneNumbers(telNumber){
    if ( telNumber === '0' ){
        telNumber = '';
    }
    return telNumber;
}


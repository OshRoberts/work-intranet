
angular.module('capgeminiNewcastleApp')

    .controller('DocumentationCtrl', function($scope, $http, $rootScope, $location, $window, ModalService, ApplicationSvc) {

        $rootScope.$watch('userDetails', function() {
            $scope.userDetails = $rootScope.userDetails;
        });

        // use to set default tab to be visible
        $scope.tab = 1;
        // indic to show edit documents popup
        $scope.showPopup = false;


        ApplicationSvc.getDocumentsMenu()
            .then(
                (res) => {
                    if (res.data.message === 'GET_SUCCESSFUL') {
                        $scope.documentsMenuList = res.data.documentsMenuList;
                        $rootScope.documentsMenuList = $scope.documentsMenuList;
                        // copied in case user amends menu but then clicks cancel
                        $scope.documentsMenuListOriginal = angular.copy($scope.documentsMenuList);

                        var vm = this;
                        vm.documentsMenuList = $scope.documentsMenuList;
                        //$scope.showInputsHolder = false;
                    } else {
                        $location.path('/login');
                    }
                },
                (err) => {
                    console.log('Something went wrong: ', err.data.message);
                }
            );



        ApplicationSvc.getDocumentsItems()
            .then(
                (res) => {
                    if (res.data.message === 'GET_SUCCESSFUL') {
                        $scope.documentsItemsList = res.data.documentsItemsList;
                        $rootScope.documentsItemsList = $scope.documentsItemsList;
                        // copied in case user amends menu but then clicks cancel
                        $scope.documentsItemsListOriginal = angular.copy($scope.documentsItemsList);

                    } else {
                        $location.path('/login');
                    }
                },
                (err) => {
                    console.log('Something went wrong: ', err.data.message);
                }
            );




        $scope.gotoDocument = function(chosenDoc){
          // if (itemId === 'TECHNOW'){
                // $window.open('https://dwp.service-now.com/side_door.do', '_blank');
               // $window.open($scope.documentsItemsList[itemId].url, '_blank');
          //  }
           // else {
                $window.open(chosenDoc.item.url, '_blank');
           // }
        };


        // show the edit menu popup
        $scope.showEditDocumentsPopup = function(){
            $scope.hover = !$scope.hover;
            $scope.showPopup = !$scope.showPopup;
        };


        // show the edit menu modal
        $scope.editMenu = function(){

            $scope.modalEditSections = true;
            $scope.hover = !$scope.hover;
            $scope.showPopup = !$scope.showPopup;
        
            ModalService.showModal({
                templateUrl: 'menuModal.html',
                controller: 'ModalController',
                scope: $scope
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    $scope.message = 'You said ' + result;
                });
            });
        };



        // // show the edit sections modal
        // $scope.editSections = function(){

        //     $scope.name = 'theNameHasBeenPassed';  //  <- for testing only

        //     $scope.modalEditSections = true;
        //     $scope.hover = !$scope.hover;
        //     $scope.showPopup = !$scope.showPopup;
        
        //     ModalService.showModal({
        //         templateUrl: 'modal.html',
        //         controller: 'ModalController'
        //     }).then(function(modal) {
        //         modal.element.modal();
        //         modal.close.then(function(result) {
        //             $scope.message = 'You said ' + result;
        //         });
        //     });
        // };



        // show the edit documents modal
        $scope.editDocuments = function(){

            $scope.showlinksHolder = false;
            $scope.selectedMenu = null;

            $scope.modalEditSections = true;
            $scope.hover = !$scope.hover;
            $scope.showPopup = !$scope.showPopup;
        
            ModalService.showModal({
                templateUrl: 'documentsModal.html',
                controller: 'ModalController',
                scope: $scope
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    $scope.message = 'You said ' + result;
                });
            });
        };



        $scope.menuSelected = function(selectedMenu){

                if (selectedMenu === null){
                    $scope.selectedMenuId = null;
                    $scope.showlinksHolder = false;

                } else {
                    $scope.selectedMenuId = selectedMenu.id;
                    $scope.showlinksHolder = true;
                }
                
            };




    });




// ##########################################################
// ModalController
// ##########################################################
angular.module('capgeminiNewcastleApp')

    .controller('ModalController', function($scope, $rootScope, $location, $window, close, ApplicationSvc, orderByFilter) {
  

// #################################### Documents Menu modal ####################################
        $rootScope.$watch('documentsMenuList', function() {
            $scope.documentsMenuList = $rootScope.documentsMenuList;
        });


        $scope.addNewMenu = function() {

            //$scope.documentsMenuList = this.documentsMenuList;
            var arrayLength = this.documentsMenuList.length;

             var obj = {
                        'id' : arrayLength+1,
                        'menuTitle' : '',
                        'menuDescription' : '',
                        'menuOrder' : arrayLength+1,
                        'isActive' : true,
                        'documentItemCount' : 0,
                        'deleteMe' : false,
                        'newIndic' : true
                    };
            this.documentsMenuList.push(obj);
            $scope.documentsMenuList = this.documentsMenuList;
        };



        $scope.isActiveMenuItem = function(index) {
            $scope.documentsMenuList = this.documentsMenuList;
            if ($scope.documentsMenuList[index].isActive === true) {
                $scope.documentsMenuList[index].deleteMe = false;
            }
        };



        $scope.deleteMenuItem = function(index) {
            $scope.documentsMenuList = this.documentsMenuList;
            $scope.documentsMenuList[index].deleteMe = true;
            $scope.documentsMenuList[index].isActive = false;
        };




        $scope.cancelMenu = function() {
            // reset menu list, in case user had amended but Cancelled and changed mind
            
            $scope.documentsMenuList = this.documentsMenuList;

            var arrayLength = $scope.documentsMenuList.length;
            for (var i = 0; i < arrayLength; i++) {
                if ( $scope.documentsMenuList[i].newIndic === true ) {
                    // remove any added menu items that the user has decided to disgard
                    $scope.documentsMenuList.splice(i, 1);
                    arrayLength--;
                    i--;
                }
            }

            
            $scope.documentsMenuList = orderByFilter($scope.documentsMenuList, '+menuOrder');
            //$scope.documentsMenuList = $scope.documentsMenuList2;

            // arrayLength = $scope.documentsMenuList.length;
            // for (i = 0; i < arrayLength; i++) {
            //     // reset array index according to the original menuOrder
            //     $scope.documentsMenuList2 = orderByFilter($scope.documentsMenuList, '+menuOrder');
            //     var osh = 1;
            //     //$scope.documentsMenuList.move( i, $scope.documentsMenuListOriginal[i].menuOrder -1 );
            //     //var osh = $filter('filter')($scope.documentsMenuListOriginal, {'menuTitle':$scope.documentsMenuList[i].menuTitle});
            //     //var a = $scope.documentsMenuListOriginal.filter(function (menu) { return menu.menuTitle === $scope.documentsMenuList[i].menuTitle; });
            //     // $scope.documentsMenuList[i].menuOrder = a.menuOrder;
            // }
            
            for (i = 0; i < arrayLength; i++) {
                // reset array titles & descriptions to original values
                $scope.documentsMenuList[i].menuTitle = $scope.documentsMenuListOriginal[i].menuTitle;
                $scope.documentsMenuList[i].menuDescription = $scope.documentsMenuListOriginal[i].menuDescription;
                $scope.documentsMenuList[i].isActive = $scope.documentsMenuListOriginal[i].isActive;
                $scope.documentsMenuList[i].documentItemCount = $scope.documentsMenuListOriginal[i].documentItemCount;
                $scope.documentsMenuList[i].deleteMe = false;
            }

            $rootScope.documentsMenuList = $scope.documentsMenuList;
        };




        $scope.saveMenu = function() {
        // $scope.submit = function() {
            // save re-ordered/amended menu list

            $scope.documentsMenuList = this.documentsMenuList;

            var arrayLength = $scope.documentsMenuList.length;
            for (var i = 0; i < arrayLength; i++) {
                // reset menuOrder according to the new index
                 $scope.documentsMenuList[i].menuOrder = i + 1;
            }
            // save the data
            ApplicationSvc.documentsMenuSave($scope.documentsMenuList)
                .then(
                    (res) => {

                        if (res.data.message === 'SAVE_SUCCESSFUL') {
                                
                            // update $rootScope with any changes
                            $rootScope.documentsMenuList = $scope.documentsMenuList;

                            $location.path('/documentation');

                        } else if (res.data.message === 'VALIDATION_ERROR') {
                            // inputs failed validation/sanitization check
                            // TODO - need to mark/ identify fields
                            
                        } else {
                            $location.path('/documentation');
                        }
                },
                (err) => {
                    console.log('Something went wrong: ', err.data.message);
                }
            ); 
        };




// #################################### Documents Items modal ####################################
        
        $rootScope.$watch('documentsItemsList', function() {
            $scope.documentsItemsList = $rootScope.documentsItemsList;
        });



        $scope.addNewItem = function() {

            //$scope.documentsMenuList = this.documentsMenuList;
            var arrayLength = this.documentsItemsList.length;

             var obj = {
                        'id' : arrayLength+1,
                        'menuId' : $scope.selectedMenuId,
                        'title' : '',
                        'description' : '',
                        'iconType' : '',
                        'url' : '',
                        'tooltipText' : '',
                        'listingOrder' : arrayLength+1,
                        'isActive' : true,
                        'deleteMe' : false,
                        'newIndic' : true
                    };
            this.documentsItemsList.push(obj);
            $scope.documentsItemsList = this.documentsItemsList;
        };



        $scope.cancelItems = function() {
            // reset items list, in case user had amended but Cancelled and changed mind
            
            $scope.documentsItemsList = this.documentsItemsList;

            var arrayLength = $scope.documentsItemsList.length;
            for (var i = 0; i < arrayLength; i++) {
                if ( $scope.documentsItemsList[i].newIndic === true ) {
                    // remove any added items that the user has decided to disgard
                    $scope.documentsItemsList.splice(i, 1);
                    arrayLength--;
                    i--;
                }
            }

            
            $scope.documentsItemsList = orderByFilter($scope.documentsItemsList, '+listingOrder');
            //$scope.documentsMenuList = $scope.documentsMenuList2;

            // arrayLength = $scope.documentsMenuList.length;
            // for (i = 0; i < arrayLength; i++) {
            //     // reset array index according to the original menuOrder
            //     $scope.documentsMenuList2 = orderByFilter($scope.documentsMenuList, '+menuOrder');
            //     var osh = 1;
            //     //$scope.documentsMenuList.move( i, $scope.documentsMenuListOriginal[i].menuOrder -1 );
            //     //var osh = $filter('filter')($scope.documentsMenuListOriginal, {'menuTitle':$scope.documentsMenuList[i].menuTitle});
            //     //var a = $scope.documentsMenuListOriginal.filter(function (menu) { return menu.menuTitle === $scope.documentsMenuList[i].menuTitle; });
            //     // $scope.documentsMenuList[i].menuOrder = a.menuOrder;
            // }
            
            for (i = 0; i < arrayLength; i++) {
                // reset array titles & descriptions to original values
                $scope.documentsMenuList[i].menuTitle = $scope.documentsMenuListOriginal[i].menuTitle;
                $scope.documentsMenuList[i].menuDescription = $scope.documentsMenuListOriginal[i].menuDescription;
                $scope.documentsMenuList[i].isActive = $scope.documentsMenuListOriginal[i].isActive;
                $scope.documentsMenuList[i].documentItemCount = $scope.documentsMenuListOriginal[i].documentItemCount;
                $scope.documentsMenuList[i].deleteMe = false;
            }

            $rootScope.documentsMenuList = $scope.documentsMenuList;
        };

    });










// Array.prototype.move = function (oldIndex, newIndex) {
//     if (newIndex >= this.length) {
//         var k = newIndex - this.length;
//         while ((k--) + 1) {
//             this.push(undefined);
//         }
//     }
//     this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
//     return this; // for testing purposes
// };





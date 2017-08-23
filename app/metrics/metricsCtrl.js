
angular.module('capgeminiNewcastleApp')

        .controller('MetricsCtrl', function($scope, $rootScope, $location, ApplicationSvc) {
                            
            //$scope.userDetails = userDetailsService.retrieveData();
            if ( $rootScope.userDetails ){
                $scope.userDetails = $rootScope.userDetails;
            }else{
                // not signed in!
                $location.path('/login');
            }


            // need metrics data available before getting to this point - batch or login??
            // currently user manually refreshes data (from TH) via button on home page
            // app currently refreshes scope on user login




     // ########## default colors - fill ##########
    var chartColorsFill = {       
        0: 'rgba(255, 99, 132, 0.2)', // red
        1: 'rgba(54, 162, 235, 0.2)', // blue
        2: 'rgba(255, 205, 86, 0.2)', // yellow
        3: 'rgba(75, 192, 192, 0.2)', // green
        4: 'rgba(153, 102, 255, 0.2)', // purple
        5: 'rgba(255, 159, 64, 0.2)', // orange
        6: 'rgba(226, 56, 236, 0.2)', // pink
        7: 'rgba(31, 69, 252, 0.2)', // dark blue
        8: 'rgba(181, 72, 77, 0.2)', // dark red
        9: 'rgba(169, 169, 169, 0.2)' // ice-white
    };

    // default colors - borders
    var chartColorsBorder = {
        0: 'rgba(255, 99, 132, 1)', // red
        1: 'rgba(54, 162, 235, 1)', // blue
        2: 'rgba(255, 205, 86, 1)', // yellow
        3: 'rgba(75, 192, 192, 1)', // green
        4: 'rgba(153, 102, 255, 1)', // purple
        5: 'rgba(255, 159, 64, 1)', // orange
        6: 'rgba(226, 56, 236, 1)', // pink
        7: 'rgba(31, 69, 252, 1)', // dark blue
        8: 'rgba(181, 72, 77, 1)', // dark red
        9: 'rgba(169, 169, 169, 1)' // ice-white
    };

// ################ Open Incidents ################
            $scope.labelsChart1 = $rootScope.labelsChart1;
            $scope.datasetsChart1 = $rootScope.datasetsChart1;

       

            // ######## Open Problems ########
            $scope.labelsChart2 = $rootScope.labelsChart2;
            $scope.datasetsChart2 = $rootScope.datasetsChart2;

            // $scope.labelsChart2 = ['CRU', 'DMACR', 'CMT', 'BCAS', 'PSOD'];
            // $scope.datasetsChart2 = [{
            //     label: '# of Problems',
            //     data: [4, 22, 8, 5, 2],
            //     backgroundColor: [
            //         chartColorsFill[0],
            //         chartColorsFill[1],
            //         chartColorsFill[2],
            //         chartColorsFill[3],
            //         chartColorsFill[4]
            //     ],
            //     borderColor: [
            //         chartColorsBorder[0],
            //         chartColorsBorder[1],
            //         chartColorsBorder[2],
            //         chartColorsBorder[3],
            //         chartColorsBorder[4]
            //     ],
            //     borderWidth: 1
            // }];


            // ######## Incidents Raised This SMP ########
            $scope.labelsChart3 = $rootScope.labelsChart3;
            $scope.datasetsChart3 = $rootScope.datasetsChart3;

            // $scope.labelsChart3 = ['CRU', 'DMACR', 'CMT', 'BCAS', 'HBSDC', 'PSOD'];
            // $scope.datasetsChart3 = [{
            //     label: '# of Incidents Raised',
            //     data: [12, 19, 3, 5, 2, 3],
            //     backgroundColor: [
            //         chartColorsFill[0],
            //         chartColorsFill[1],
            //         chartColorsFill[2],
            //         chartColorsFill[3],
            //         chartColorsFill[4],
            //         chartColorsFill[5]
            //     ],
            //     borderColor: [
            //         chartColorsBorder[0],
            //         chartColorsBorder[1],
            //         chartColorsBorder[2],
            //         chartColorsBorder[3],
            //         chartColorsBorder[4],
            //         chartColorsBorder[5]
            //     ],
            //     borderWidth: 1
            // }];


            // ######## Problems Raised This SMP ########
            $scope.labelsChart4 = $rootScope.labelsChart4;
            $scope.datasetsChart4 = $rootScope.datasetsChart4;


            // $scope.labelsChart4 = ['CRU', 'DMACR', 'CMT', 'BCAS'];
            // $scope.datasetsChart4 = [{
            //     label: '# of Votes',
            //     data: [2, 3, 7, 3],
            //     backgroundColor: [
            //         chartColorsFill[0],
            //         chartColorsFill[1],
            //         chartColorsFill[2],
            //         chartColorsFill[3]
            //     ],
            //     borderColor: [
            //         chartColorsBorder[0],
            //         chartColorsBorder[1],
            //         chartColorsBorder[2],
            //         chartColorsBorder[3]
            //     ],
            //     borderWidth: 1
            // }];


            // ######## DWP ADEP Incident Activity to SMP03/2017 ########
            $scope.labelsChart5 = ['SMP03', 'SMP04', 'SMP05', 'SMP06', 'SMP07', 'SMP08', 'SMP09', 'SMP10', 'SMP11', 'SMP12', 'SMP01-17', 'SMP02-17', 'SMP03-17'];
            $scope.datasetsChart5 = [{
                label: '# of Incidents Raised',
                data: [12, 19, 3, 5, 2, 3, 19, 9, 25, 21, 13, 8, 15],
                backgroundColor: chartColorsFill[0],
                borderColor: chartColorsBorder[0],
                fill: false,
                pointRadius: 5,
                pointColor: chartColorsFill[0]
            },
            {
                label: '# of Incidents Closed',
                data: [4, 5, 13, 5, 4, 3, 10, 9, 11, 8, 16, 18, 9],
                backgroundColor: chartColorsFill[1],
                borderColor: chartColorsBorder[1],
                fill: false,
                pointRadius: 5,
                pointColor: chartColorsFill[1]
            }];


            $scope.lastUpdatedTimeIncidents = $rootScope.metricsDataLastUpdated;
            $scope.currentSMP = $rootScope.currentSMP;

            
            $scope.userClosedMostIncidentsThisSMP = $rootScope.userClosedMostIncidentsThisSMP;
            $scope.userClosedMostIncidentsThisSMPCount = $rootScope.userClosedMostIncidentsThisSMPCount;
            $scope.userClosedMostIncidentsThisYear = $rootScope.userClosedMostIncidentsThisYear;
            $scope.userClosedMostIncidentsThisYearCount = $rootScope.userClosedMostIncidentsThisYearCount;
            $scope.usersClosedMostIncidentsAllTime = $rootScope.usersClosedMostIncidentsAllTime;
            $scope.closedIncidentsTotalCount = $rootScope.closedIncidentsTotalCount;
            // now format total to include thousands separator
            $scope.closedIncidentsTotalCount = String($scope.closedIncidentsTotalCount).replace(/(.)(?=(\d{3})+$)/g,'$1,')



  // $scope.myInterval = 5000;
  $scope.myInterval = 0;
  $scope.noWrapSlides = false;
  $scope.active = 0;
  
  var slides = $scope.slides = [];
  var currIndex = 0;


  $scope.addSlide = function() {
    var newWidth = 600 + slides.length + 1;
    slides.push({
      image: '//unsplash.it/' + newWidth + '/300',
      text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
      id: currIndex++
    });
  };

  for (var i = 0; i < 4; i++) {
    $scope.addSlide();
  }


  

  // Randomize logic below
  // $scope.randomize = function() {
  //   var indexes = generateIndexesArray();
  //   assignNewIndexesToSlides(indexes);
  // };
  
  // function assignNewIndexesToSlides(indexes) {
  //   for (var i = 0, l = slides.length; i < l; i++) {
  //     slides[i].id = indexes.pop();
  //   }
  // }

  // function generateIndexesArray() {
  //   var indexes = [];
  //   for (var i = 0; i < currIndex; ++i) {
  //     indexes[i] = i;
  //   }
  //   return shuffle(indexes);
  // }

  // http://stackoverflow.com/questions/962802#962890
  // function shuffle(array) {
  //   var tmp, current, top = array.length;

  //   if (top) {
  //     while (--top) {
  //       current = Math.floor(Math.random() * (top + 1));
  //       tmp = array[current];
  //       array[current] = array[top];
  //       array[top] = tmp;
  //     }
  //   }

  //   return array;
  // }


// $scope.slides = [];
//   $scope.slides.push({text: 'cats!', image: 'http://placekitten.com/300/200'});
//   $scope.slides.push({text: 'dogs!', image: 'http://placekitten.com/301/200'});
//   $scope.slides.push({text: 'sheep!', image: 'http://placekitten.com/302/200'});
  




  


        });

angular.module('capgeminiNewcastleApp')
    .service('ApplicationSvc', function ($http) {


// ########################### Login ###########################

    this.login = function (email, password) {
        console.log('post login: ' +  email);
        return $http.post('/admin/login',{email:email, password:password})
            .then( 
                (res) => {
                    authSuccessful(res);
                    return res;
                },
                (error) => {
                    console.log('post login error' );
                   return error;
                }  
            );
        };




// ########################### Password Reset ###########################

    this.passwordReset = function (email) {
        console.log('post passwordReset: ' +  email);
        return $http.post('/admin/passwordReset',{email:email})
            .then( 
                (res) => {
                    switch ( res.data.message )
                    {
                        case 'RESET_SUCCESSFUL': 
                                toastr.success( 'A password reset email has been sent to: ' + email, 'ADMIN MESSAGE:<br>' );
                                break;
                        case 'EMAIL_NOT_FOUND':
                                toastr.error('ADMIN MESSAGE:<br>' + 'Email address not found!');
                                break;
                        default:
                                toastr.error('ADMIN MESSAGE:<br>' + res.data.message );                
                    }
                    return res;
                },
                (error) => {
                    console.log('post login error' );
                   return error;
                }  
            );
        };




// ########################### User Admin ###########################

        this.userAdminGet = function () {
            console.log('post userAdminGet: ');
            return  $http.post('/admin/userAdminGet',{}) 
                .then( 
                   (res) => {
                      // requestAccessCheck(res);
                       return res;
                   },
                   (error) => {
                        console.log('post userAdminGet error' );
                   }  
                );
        };


        this.userAdminUpdate = function (selectedUser) {
            console.log('post profile update: ' +  selectedUser.firstname);
            return $http.post('/admin/userAdminUpdate',{selectedUser})
                .then( 
                    (res) => {
                        profileUpdateSuccessful(res);
                        return res;
                    },
                    (error) => {
                        console.log('post save profile error' );
                        return error;
                    }  
                );
            };


            

// ########################### Profile ###########################

        this.profileGet = function (workEmail) {
            console.log('post userAdminGet: ');
            return  $http.post('/admin/profileGet',{workEmail:workEmail}) 
                .then( 
                   (res) => {
                       console.log('ooo');
                       return res;
                   },
                   (error) => {
                        console.log('post profileGet error' );
                   }  
                );
        };




    this.profileUpdate = function (userProfile) {
        console.log('post profile update: ' +  userProfile.firstname);
        return $http.post('/admin/profileUpdate',{userProfile})
            .then( 
                (res) => {
                    profileUpdateSuccessful(res);
                    return res;
                },
                (error) => {
                    console.log('post save profile error' );
                    return error;
                }  
            );
        };



// ########################### Documents & Links ###########################

        this.getDocumentsMenu = function () {
            console.log('post getDocumentsMenu: ');
            return  $http.post('/admin/getDocumentsMenu',{}) 
                .then( 
                   (res) => {
                       return res;
                   },
                   (error) => {
                        console.log('post getDocumentsMenu error' );
                   }  
                );
        };



        this.getDocumentsItems = function () {
            console.log('post getDocumentsItems: ');
            return  $http.post('/admin/getDocumentsItems',{}) 
                .then( 
                   (res) => {
                       return res;
                   },
                   (error) => {
                        console.log('post getDocumentsItems error' );
                   }  
                );
        };




        this.documentsMenuSave = function (documentsMenuList) {
            console.log('post documentsMenuSave: ');
            return $http.post('/admin/documentsMenuSave',{documentsMenuList})
            .then( 
                (res) => {
                    documentMenuSuccessful(res);
                    return res;
                },
                (error) => {
                    console.log('post save documentsMenuSave error' );
                    return error;
                }  
            );
        };





// ########################### Contacts ###########################

        this.getContactsMenu = function () {
            console.log('post getContactsMenu: ');
            return  $http.post('/admin/getContactsMenu',{}) 
                .then( 
                   (res) => {
                       return res;
                   },
                   (error) => {
                        console.log('post getContactsMenu error' );
                   }  
                );
        };

        this.getContactsSections = function () {
            console.log('post getContactsSections: ');
            return  $http.post('/admin/getContactsSections',{}) 
                .then( 
                   (res) => {
                       return res;
                   },
                   (error) => {
                        console.log('post getContactsSections error' );
                   }  
                );
        };


        this.getContactsItems = function () {
            console.log('post getContactsItems: ');
            return  $http.post('/admin/getContactsItems',{}) 
                .then( 
                   (res) => {
                       return res;
                   },
                   (error) => {
                        console.log('post getContactsItems error' );
                   }  
                );
        };


            

// ########################### Metrics ###########################

        this.ImportFromTicketHandlingSpreadsheet = function () {
            console.log('post ImportFromTicketHandlingSpreadsheet: ');
            return  $http.post('/admin/ImportFromTicketHandlingSpreadsheet',{}) 
                .then( 
                   (res) => {
                       console.log('xx');
                       return res;
                   },
                   (error) => {
                        console.log('post ImportFromTicketHandlingSpreadsheet error' );
                   }  
                );
        };


        this.metricsIncidentsOpenGet = function () {
            console.log('post metricsIncidentsOpenGet: ');
            return  $http.post('/admin/metricsIncidentsOpenGet',{}) 
                .then( 
                   (res) => {
                       return res;
                   },
                   (error) => {
                        console.log('post metricsIncidentsOpenGet error' );
                   }  
                );
        };


        this.metricsIncidentsRaisedThisSMPGet = function () {
            console.log('post metricsIncidentsRaisedThisSMPGet: ');
            return  $http.post('/admin/metricsIncidentsRaisedThisSMPGet',{}) 
                .then( 
                   (res) => {
                       return res;
                   },
                   (error) => {
                        console.log('post metricsIncidentsRaisedThisSMPGet error' );
                   }  
                );
        };


        this.metricsDataLastUpdatedGet = function () {
            console.log('post metricsDataLastUpdatedGet: ');
            return  $http.post('/admin/metricsDataLastUpdatedGet',{}) 
                .then( 
                   (res) => {
                       return res;
                   },
                   (error) => {
                        console.log('post metricsDataLastUpdatedGet error' );
                   }  
                );
        };


        this.metricsProblemsOpenGet = function () {
            console.log('post metricsProblemsOpenGet: ');
            return  $http.post('/admin/metricsProblemsOpenGet',{}) 
                .then( 
                   (res) => {
                       return res;
                   },
                   (error) => {
                        console.log('post metricsProblemsOpenGet error' );
                   }  
                );
        };


        this.metricsProblemsRaisedThisSMPGet = function () {
            console.log('post metricsProblemsRaisedThisSMPGet: ');
            return  $http.post('/admin/metricsProblemsRaisedThisSMPGet',{}) 
                .then( 
                   (res) => {
                       return res;
                   },
                   (error) => {
                        console.log('post metricsProblemsRaisedThisSMPGet error' );
                   }  
                );
        };


        this.metricsUserActivityIncidentsGet = function () {
            console.log('post metricsUserActivityIncidentsGet: ');
            return  $http.post('/admin/metricsUserActivityIncidentsGet',{}) 
                .then( 
                   (res) => {
                       return res;
                   },
                   (error) => {
                        console.log('post metricsUserActivityIncidentsGet error' );
                   }  
                );
        };



























// ########################### Register call to express/db for new users

        this.register = function (email, password, firstname, surname) {
            console.log('post register: ' +  email);
            return  $http.post('/admin/register',{email:email, password:password, firstname:firstname, surname:surname}) 
                .then( 
                   (res) => {
                       authSuccessful(res);
                       return res;
                   },
                   (error) => {
                        console.log('post registration error' );
                   }  
                );
        };





// ########################### Request Access - email exists check?

        this.requestAccess = function (email, firstname, surname) {
            console.log('post requestAccess: ' +  email);
            return  $http.post('/admin/requestAccess',{email:email, firstname:firstname, surname:surname}) 
                .then( 
                   (res) => {
                       requestAccessCheck(res);
                       return res;
                   },
                   (error) => {
                        console.log('post requestAccess error' );
                   }  
                );
        };








// ######################################################  Functions  #################################################################################

    function authSuccessful(res){
        // TODO Set any system variables to deny/allow access to system
        console.log('Admin message: ' + res.data.message);
        switch ( res.data.message )
        {
            case 'LOGIN_NOT_SUCCESSFUL':
                    toastr.error('ADMIN MESSAGE:<br>' + 'Username/password combination does not exist!');
                    break;
            case 'LOGIN_SUCCESSFUL': 
                    toastr.success( 'Hi ' + res.data.user.firstname, 'ADMIN MESSAGE:<br>' );
                    break;
            // case 'REGISTRATION_SUCCESSFUL':
            //         toastr.success( res.data.message, 'ADMIN MESSAGE:<br>' );
            //         break;
            // case 'USER_ALREADY_EXIST':
            //         toastr.error('ADMIN MESSAGE:<br>' + 'Username already exists');
            //         break;
            default:
                    toastr.error('ADMIN MESSAGE:<br>' + res.data.message );                
        }
    }


function profileUpdateSuccessful(res){
        // TODO Set any system variables to deny/allow access to system
        console.log('Admin message: ' + res.data.message);
        switch ( res.data.message )
        {
            case 'SAVE_SUCCESSFUL':
                    toastr.success('ADMIN MESSAGE:<br>' + 'Save successful');
                    break;
            case 'EMAIL_ALREADY_USED': 
                    toastr.error('ADMIN MESSAGE:<br>' + 'Work Email already used by another user!');
                    break;
            case 'VALIDATION_ERROR': 
                    toastr.error('ADMIN MESSAGE:<br>' + 'Validation Error!');
                    break;
            default:
                    toastr.error('ADMIN MESSAGE:<br>' + res.data.message );                
        }
    }


function documentMenuSuccessful(res){
        // TODO Set any system variables to deny/allow access to system
        console.log('Admin message: ' + res.data.message);
        switch ( res.data.message )
        {
            case 'SAVE_SUCCESSFUL':
                    toastr.success('ADMIN MESSAGE:<br>' + 'Save successful');
                    break;
            case 'VALIDATION_ERROR': 
                    toastr.error('ADMIN MESSAGE:<br>' + 'Validation Error!');
                    break;
            default:
                    toastr.error('ADMIN MESSAGE:<br>' + res.data.message );                
        }
    }







    function requestAccessCheck(res){
        // TODO Set any system variables to deny/allow access to system
        console.log('Admin message: ' + res.data.message);
        switch ( res.data.message )
        {
            case 'REQUESTACCESS_CHECK_SUCCESSFUL':
                    toastr.success('ADMIN MESSAGE:<br>' + 'Your request has been sent.<br> You will receive an email shortly.');  
                    break;
            case 'REQUESTACCESS_CHECK_NOT_SUCCESSFUL': 
                    toastr.error('ADMIN MESSAGE:<br>' + 'Username already exists!');
                    break;
            default:
                    toastr.error('ADMIN MESSAGE:<br>' + res.data.message );                
        }
    }


});

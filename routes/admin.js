
var express = require('express'); 
var app = express();
var router = express.Router();

var mongodb = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/capgeminiNewcastleApp';

var bcrypt = require('bcrypt-node');
var validator = require('validator');
var nodemailer = require('nodemailer');
var Excel = require('exceljs');



// ##################################################################################################
// Login
// ##################################################################################################

    router.post('/login', (req, res) => {
        req.user = req.body;
        //console.log('/login: ' + req.user.email + ', pw: ' + req.user.password);

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('users');

            // Check login details
            collection.find({'workEmail': req.user.email}).toArray((err, docs) => {
                // Check if user exist
                if ( docs.length === 0 ) {
                    // User does not exist
                    db.close();
                    //res.status(200).send({ message: 'LOGIN_DOES_NOT_EXIST'});
                    res.status(200).send({ message: 'LOGIN_NOT_SUCCESSFUL'});
                } else {
                    // User does exist in system

                    // Check if passwords match
                    // req.user.password is the user entered plain text password
                    // docs[0].password  is the 'hash' (encrypted password) in DB
                    bcrypt.compare( req.user.password, docs[0].password, function(err,isMatch) {
                        if (err) { console.log('bcrypt.compare error:'); return (err); }
                        //console.log(docs);
                        db.close();
                        if ( isMatch === true ) {
                            // console.log('Passwords match');
                            
                            // blank out sensitive fields!!
                            docs[0].password = '';
                            docs[0].salt = '';
                            res.status(200).send({ user: docs[0], message: 'LOGIN_SUCCESSFUL' });
                            
                        } else {
                            // console.log('Passwords do not match');
                            //res.status(200).send({ message: 'LOGIN_PASSWORD_INCORRECT' });  
                            res.status(200).send({ message: 'LOGIN_NOT_SUCCESSFUL'});                      
                        }
                    });
                }
            });
        });
    });





// ##################################################################################################
// Password Reset  
// ##################################################################################################

    router.post('/passwordReset', (req, res) => {
        req.user = req.body;
        //console.log('/login: ' + req.user.email + ', pw: ' + req.user.password);

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('users');

            // Check login details
            collection.find({'workEmail': req.user.email}).toArray((err, docs) => {
                // Check if user exist
                if ( docs.length === 0 ) {
                    // User does not exist
                    db.close();
                    res.status(200).send({ message: 'EMAIL_NOT_FOUND'});
                } else {
                    // User does exist in system
                    
                    // reset password in db
                    // generate new guid url + create email and send to user!

                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'capgeminiNE@gmail.com',
                            pass: 'Cg6X3Lg@5#!1'
                        }
                    });

                    var mailOptions = {
                        from: 'capgeminiNE@gmail.com',
                        // to: req.user.email,
                        to: 'osian.roberts@capgemini.com',
                        subject: 'Capgemini NE website - Password Reset',
                        text: 'That was easy!'
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    res.status(200).send({ user: docs[0], message: 'RESET_SUCCESSFUL' });
                      
                }
            });
        });
    });






// ##################################################################################################
// User Admin  
// ##################################################################################################

    router.post('/userAdminGet', (req, res) => {
        req.user = req.body;
        //console.log('/login: ' + req.user.email + ', pw: ' + req.user.password);

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('users');

            // get data
            // collection.find({ isActive: { $ne: 0 } }).sort( { firstname: 1 } ).toArray((err, docs) => {
            collection.find().sort( { isActive: -1 , firstname: 1 } ).toArray((err, docs) => {

                    db.close();
                    //res.json(docs);
                    res.status(200).send({ allUsers: docs, message: 'GET_SUCCESSFUL' });
                            
            });
        });
    });



    router.post('/userAdminUpdate', (req, res) => {
        req.user = req.body.selectedUser;
        
        // need to clean and check all inputs for dodgyness!
        var safeIndic = true;
        if ( validator.isEmail(req.user.workEmail) === false ){
            safeIndic = false;
        }
        if ( validator.isAlphanumeric(req.user.firstname, 'en-GB') === false ){
            safeIndic = false;
            res.status(200).send({ message: 'VALIDATION_ERROR'});
        }
        // ..... etc


        if (safeIndic === true) {
            // passed validation / sanitization

            mongodb.connect(url, (err, db) => {
                if ( err ) {console.log('Error connecting to mongoDB', err); return; }
                // Connected to DB
                var collection = db.collection('users');

                // insert new record or update existing?
                if ( req.user.newUserIndic === true){
                    // new user

                    // get max userCode

                    // insert new user







                } else {
                    // user already exists

                    // check email address is not used by another user
                    collection.find({'workEmail': req.user.workEmail}).toArray((err, docs) => {

                        if ( docs.length === 0) {
                            // workEmail does not exist in db, therefore new email addy

                            // update data
                            collection.update(
                                { userCode: req.user.userCode },
                                { $set:
                                    {
                                        firstname: req.user.firstname,
                                        surname: req.user.surname,
                                        userLevel: req.user.userLevel,
                                        documentsEditor: req.user.documentsEditor,
                                        staffId: req.user.staffId,
                                        workEmail: req.user.workEmail,
                                        workTel: req.user.workTel,
                                        workMobile: req.user.workMobile,
                                        homeEmail: req.user.homeEmail,
                                        homeTel: req.user.homeTel,
                                        homeMobile: req.user.homeMobile,
                                        homeAddress1: req.user.homeAddress1,
                                        homeAddress2: req.user.homeAddress2,
                                        homeAddress3: req.user.homeAddress3,
                                        homeAddress4: req.user.homeAddress4,
                                        homePostcode: req.user.homePostcode,
                                        emergencyContactName: req.user.emergencyContactName,
                                        emergencyContactTel: req.user.emergencyContactTel,
                                        leaveQuota: req.user.leaveQuota
                                    }
                                }
                            );

                            db.close();
                            res.status(200).send({ message: 'SAVE_SUCCESSFUL'});

                        } else if ( docs.length === 1  && docs[0].userCode === req.user.userCode) {
                            // workEmail does exist but for current user only - email not changed
                            
                            // update data
                            collection.update(
                                { userCode: req.user.userCode },
                                { $set:
                                    {
                                        firstname: req.user.firstname,
                                        surname: req.user.surname,
                                        userLevel: req.user.userLevel,
                                        documentsEditor: req.user.documentsEditor,
                                        staffId: req.user.staffId,
                                        workEmail: req.user.workEmail,
                                        workTel: req.user.workTel,
                                        workMobile: req.user.workMobile,
                                        homeEmail: req.user.homeEmail,
                                        homeTel: req.user.homeTel,
                                        homeMobile: req.user.homeMobile,
                                        homeAddress1: req.user.homeAddress1,
                                        homeAddress2: req.user.homeAddress2,
                                        homeAddress3: req.user.homeAddress3,
                                        homeAddress4: req.user.homeAddress4,
                                        homePostcode: req.user.homePostcode,
                                        emergencyContactName: req.user.emergencyContactName,
                                        emergencyContactTel: req.user.emergencyContactTel,
                                        leaveQuota: req.user.leaveQuota
                                    }
                                }
                            );

                            db.close();
                            res.status(200).send({ message: 'SAVE_SUCCESSFUL'});

                        } else {
                            // email already used by other user 
                            res.status(200).send({ message: 'EMAIL_ALREADY_USED'});                      
                        }
                    });
                }

            });
        }
        
    });







// ##################################################################################################
// Profile 
// ##################################################################################################

    router.post('/profileGet', (req, res) => {
        req.user = req.body;

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('users');

            // Check login details
            collection.find({'workEmail': req.user.workEmail}).toArray((err, docs) => {
                // Check if user exist
                if ( docs.length === 0 ) {
                    // User not found
                    db.close();
                    res.status(200).send({ message: 'GET_NOT_SUCCESSFUL'});
                } else {
                    // User does exist in system

                    docs[0].password = '';
                    docs[0].salt = '';
                    res.status(200).send({ user: docs[0], message: 'GET_SUCCESSFUL' });
                }
            });
        });
    });



    router.post('/profileUpdate', (req, res) => {
        req.user = req.body.userProfile;
        
        // need to clean and check all inputs for dodgyness!
        var safeIndic = true;
        if ( validator.isEmail(req.user.workEmail) === false ){
            safeIndic = false;
        }
        if ( validator.isAlphanumeric(req.user.firstname, 'en-GB') === false ){
            safeIndic = false;
            res.status(200).send({ message: 'VALIDATION_ERROR'});
        }
        


        if (safeIndic === true) {
            // passed validation / sanitization

            mongodb.connect(url, (err, db) => {
                if ( err ) {console.log('Error connecting to mongoDB', err); return; }
                // Connected to DB
                var collection = db.collection('users');


                // check email address is not used by another user
                collection.find({'workEmail': req.user.workEmail}).toArray((err, docs) => {

                    if ( docs.length === 0) {
                        // workEmail does not exist in db, therefore new email addy

                        // update data
                        collection.update(
                            { userCode: req.user.userCode },
                            { $set:
                                {
                                    firstname: req.user.firstname,
                                    surname: req.user.surname,
                                    userLevel: req.user.userLevel,
                                    staffId: req.user.staffId,
                                    workEmail: req.user.workEmail,
                                    workTel: req.user.workTel,
                                    workMobile: req.user.workMobile,
                                    homeEmail: req.user.homeEmail,
                                    homeTel: req.user.homeTel,
                                    homeMobile: req.user.homeMobile,
                                    homeAddress1: req.user.homeAddress1,
                                    homeAddress2: req.user.homeAddress2,
                                    homeAddress3: req.user.homeAddress3,
                                    homeAddress4: req.user.homeAddress4,
                                    homePostcode: req.user.homePostcode,
                                    emergencyContactName: req.user.emergencyContactName,
                                    emergencyContactTel: req.user.emergencyContactTel,
                                    leaveQuota: req.user.leaveQuota
                                }
                            }
                        );

                        db.close();
                        res.status(200).send({ message: 'SAVE_SUCCESSFUL'});

                    } else if ( docs.length === 1  && docs[0].userCode === req.user.userCode) {
                        // workEmail does exist but for current user only - email not changed
                        
                        // update data
                        collection.update(
                            { userCode: req.user.userCode },
                            { $set:
                                {
                                    firstname: req.user.firstname,
                                    surname: req.user.surname,
                                    userLevel: req.user.userLevel,
                                    staffId: req.user.staffId,
                                    workEmail: req.user.workEmail,
                                    workTel: req.user.workTel,
                                    workMobile: req.user.workMobile,
                                    homeEmail: req.user.homeEmail,
                                    homeTel: req.user.homeTel,
                                    homeMobile: req.user.homeMobile,
                                    homeAddress1: req.user.homeAddress1,
                                    homeAddress2: req.user.homeAddress2,
                                    homeAddress3: req.user.homeAddress3,
                                    homeAddress4: req.user.homeAddress4,
                                    homePostcode: req.user.homePostcode,
                                    emergencyContactName: req.user.emergencyContactName,
                                    emergencyContactTel: req.user.emergencyContactTel,
                                    leaveQuota: req.user.leaveQuota
                                }
                            }
                        );

                        db.close();
                        res.status(200).send({ message: 'SAVE_SUCCESSFUL'});

                    } else {
                        // email already used by other user 
                        res.status(200).send({ message: 'EMAIL_ALREADY_USED'});                      
                    }
                });
            });
        }
        
    });








// ##################################################################################################
// Documents & Links 
// ##################################################################################################

    router.post('/getDocumentsMenu', (req, res) => {
        req.user = req.body;

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('documentsMenu');
            var collectionTwo = db.collection('documentsItems');

            collectionTwo.aggregate(
                [
                    {
                        $group : {
                            _id : '$menuId', 
                            count : { $sum : 1 }
                        }
                    },
                    {
                        $sort : {id : 1}
                    }
                ]
            ).toArray((err, documentCounts) =>{
                //console.log(documentCounts);

                collection.find().sort( { menuOrder: 1 } ).toArray((err, docs) => {

                    db.close();
                    
                    var arrayLength = docs.length;
                    for (var i = 0; i < arrayLength; i++) {
                        // add documentItems count to docs array

                        var arrayLength2 = documentCounts.length;
                        for (var x = 0; x < arrayLength2; x++) {

                            if ( docs[i].id === documentCounts[x]._id ) {
                                docs[i].documentItemCount = documentCounts[x].count;
                                break;
                            }
                            else {
                                docs[i].documentItemCount = 0;
                            }
                            // set default values for indics
                            docs[i].deleteMe = false;
                            docs[i].newIndic = false;
                        }
                    }
                    res.status(200).send({ documentsMenuList: docs, message: 'GET_SUCCESSFUL' });
                            
                });
            });
        });
    });



    router.post('/getDocumentsItems', (req, res) => {
        req.user = req.body;

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('documentsItems');

            // get data
            collection.find({ isActive: { $ne: false } }).sort( { listingOrder: 1 } ).toArray((err, docs) => {

                    db.close();
                    //res.json(docs);
                    res.status(200).send({ documentsItemsList: docs, message: 'GET_SUCCESSFUL' });
                            
            });
        });
    });




    router.post('/documentsMenuSave', (req, res) => {
        req.menuList = req.body.documentsMenuList;
        
        // need to clean and check all inputs for dodgyness!
        var safeIndic = true;

        var arrayLength = req.menuList.length;
        for (var i = 0; i < arrayLength; i++) {
            // if ( validator.isAlphanumeric(req.menuList[i].menuTitle, 'en-GB') === false ){
            //     safeIndic = false;
            // }
            // if ( validator.isAlphanumeric(req.menuList[i].menuDescription, 'en-GB') === false ){
            //     safeIndic = false;
            // }
        }


        if ( safeIndic === false ) {
            res.status(200).send({ message: 'VALIDATION_ERROR'});
        }
        else if (safeIndic === true) {
            // passed validation / sanitization

            mongodb.connect(url, (err, db) => {
                if ( err ) {
                    console.log('Error connecting to mongoDB', err); 
                    res.status(200).send({ message: 'DATABASE_CONNECTION_ERROR'})
                    return; 
                }
                // Connected to DB
                var collection = db.collection('documentsMenu');

                // loop thru array to save all menu entries
                var arrayLength = req.menuList.length;
                for (var i = 0; i < arrayLength; i++) {
                        
                    if (req.menuList[i].newIndic === true && req.menuList[i].deleteMe === false) {
                        // insert new menu item
                        collection.insert( 
                            { 
                                id: req.menuList[i].id, 
                                menuTitle: req.menuList[i].menuTitle,
                                menuDescription: req.menuList[i].menuDescription,
                                menuOrder: req.menuList[i].menuOrder,
                                isActive: req.menuList[i].isActive 
                            } 
                        );

                    }
                    else if (req.menuList[i].deleteMe === true && req.menuList[i].newIndic === false) {
                        // delete existing menu item marked for deletion
                        //var query = {id: req.menuList[i].id};
                        collection.remove( 
                            {
                                id: req.menuList[i].id
                            },
                                true 
                        );
                    }
                    else {
                        // update existing menu item
                        collection.update(
                            { id: req.menuList[i].id },
                            { $set:
                                {
                                    menuTitle: req.menuList[i].menuTitle,
                                    menuDescription: req.menuList[i].menuDescription,
                                    menuOrder: req.menuList[i].menuOrder,
                                    isActive: req.menuList[i].isActive
                                }
                            }
                        );

                    }
                }
                res.status(200).send({ message: 'SAVE_SUCCESSFUL'});
                db.close();
            });
        }
        
    });







// ##################################################################################################
//  Contacts 
// ##################################################################################################

    router.post('/getContactsMenu', (req, res) => {
        req.user = req.body;

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('contactsMenu');

            // get data
            collection.find({ isActive: { $ne: false } }).sort( { menuOrder: 1 } ).toArray((err, docs) => {
            //collection.find().sort( { menuOrder: 1 } ).toArray((err, docs) => {

                    db.close();
                    //res.json(docs);
                    res.status(200).send({ contactsMenuList: docs, message: 'GET_SUCCESSFUL' });
                            
            });
        });
    });



    router.post('/getContactsSections', (req, res) => {
        req.user = req.body;

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('contactsSections');

            // get data
            collection.find({ isActive: { $ne: false } }).sort( { sectionOrder: 1 } ).toArray((err, docs) => {
            //collection.find().sort( { menuOrder: 1 } ).toArray((err, docs) => {

                    db.close();
                    //res.json(docs);
                    res.status(200).send({ contactsSectionsList: docs, message: 'GET_SUCCESSFUL' });
                            
            });
        });
    });
    
    
    
    router.post('/getContactsItems', (req, res) => {
        req.user = req.body;

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('contactsItems');

            // get data
            collection.find({ isActive: { $ne: false } }).sort( { name: 1 } ).toArray((err, docs) => {

                    db.close();
                    //res.json(docs);
                    res.status(200).send({ contactsItemsList: docs, message: 'GET_SUCCESSFUL' });
                            
            });
        });
    });






// ##################################################################################################
//  Metrics 
// ##################################################################################################

// Get data from TH into MongoDb ####################################################################
    router.post('/ImportFromTicketHandlingSpreadsheet', (req, res) => {
        req.user = req.body;

        var filename = './IncProbLog/CAPG_Inc_Prb_Chg_Log_copy_230617.xlsx';
        // var filename = './IncProbLog/CAPG_Inc_Prb_Chg_Log_copy_140717.xlsx';

        var incidentSheet = 'Incident';
        var tmpArray = [];
        var incidentArray = [];

        var rollingSMPsSheet = 'RollingSMPs';
        var tmpArray2 = [];
        var rollingSMPsArray = [];
        
        var problemSheet = 'Problem-KA';
        var tmpArray3 = [];
        var problemArray = [];


// ############## Read Ticket Handling Spreadsheet ##############
        var workbook = new Excel.Workbook(); 
        workbook.xlsx.readFile(filename)
            .then(function() {

        // ############## Incidents ##############
                var worksheet = workbook.getWorksheet(incidentSheet);  

                worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                    //console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
                    
                    // place worksheet data into tmpArray
                    tmpArray.push(row.values);
                });

                // loop thru array to save all entries
                var arrayLength = tmpArray.length;
                for (var i = 1; i < arrayLength; i++) {

                    incidentArray.push({
                        'application': tmpArray[i][1], 
                        'allocatedDate': tmpArray[i][2],
                        'incidentNumber': tmpArray[i][3],
                        'incidentSeverity': tmpArray[i][4],
                        'reassigmentCode': tmpArray[i][5],
                        'problemType': tmpArray[i][6],
                        'arisingFromRelease': tmpArray[i][7],
                        'briefDescription': tmpArray[i][8],
                        'smeName': tmpArray[i][9],
                        'resolutionSummary': tmpArray[i][10],
                        'status': tmpArray[i][11],
                        'readOnlySQL': tmpArray[i][12],
                        'datafixViaInc': tmpArray[i][13],
                        'ticketTransferDate': tmpArray[i][14],
                        'EffortInDays': tmpArray[i][15],
                        'userErrorWTD': tmpArray[i][16],
                        'runningTime': tmpArray[i][17],
                        'remarksNotes': tmpArray[i][18],
                        'problemNumber': tmpArray[i][19],
                        'incidentClassification': tmpArray[i][20],
                        'SMP': tmpArray[i][21]
                    });
                    
                }

        // ############## RollingSMPs ##############
                var worksheet2 = workbook.getWorksheet(rollingSMPsSheet);  

                worksheet2.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                    //console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
                    
                    // place worksheet data into tmpArray
                    tmpArray2.push(row.values);
                });

                // loop thru array to save all entries
                var arrayLength2 = tmpArray2.length;
                for (var j = 1; j < arrayLength2; j++) {

                    rollingSMPsArray.push({
                        'period': tmpArray2[j][1], 
                        'month': tmpArray2[j][2],
                        'start': tmpArray2[j][3],
                        'end': tmpArray2[j][4],
                        'weeks': tmpArray2[j][5],
                        'reportingYear': tmpArray2[j][6]
                    });
                    
                }


        // ############## Problems ##############
                var worksheet3 = workbook.getWorksheet(problemSheet);  

                worksheet3.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                    //console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
                    
                    // place worksheet data into tmpArray
                    tmpArray3.push(row.values);
                });

                // loop thru array to save all entries
                var arrayLength3 = tmpArray3.length;
                for (var k = 1; k < arrayLength3; k++) {

                    problemArray.push({
                        'application': tmpArray3[k][1], 
                        'problemRaisedDate': tmpArray3[k][2],
                        'kaTargetDate': tmpArray3[k][3],
                        'problemNumber': tmpArray3[k][4],
                        'knownErrorReference': tmpArray3[k][5],
                        'severity': tmpArray3[k][6],
                        'urgency': tmpArray3[k][7],
                        'problemType': tmpArray3[k][8],
                        'title': tmpArray3[k][9],
                        'smeName': tmpArray3[k][10],
                        'resolutionSummary': tmpArray3[k][11],
                        'status': tmpArray3[k][12],
                        'fixAvailableDate': tmpArray3[k][13],
                        'closedDate': tmpArray3[k][14],
                        'incidentNumberSeverity': tmpArray3[k][15],
                        'kaTaskIssued': tmpArray3[k][16],
                        'kaTaskStatus': tmpArray3[k][17],
                        'checkKBSubmissionStatus': tmpArray3[k][18],
                        'kaVersion': tmpArray3[k][19],
                        'kaIssuedToDWP': tmpArray3[k][20],
                        'kaIssuedToASL2': tmpArray3[k][21],
                        'kaNumberHistorical': tmpArray3[k][22],
                        'validToDate': tmpArray3[k][23],
                        'notes': tmpArray3[k][24]
                    });
                    
                }






// ############## insert data into db ##############
                mongodb.connect(url, (err, db) => {
                    if ( err ) {
                        console.log('Error connecting to mongoDB', err); 
                        res.status(200).send({ message: 'DATABASE_CONNECTION_ERROR'})
                        return; 
                    }

                    // Connected to DB
                    var collection = db.collection('dataIncidents');

                    // remove all existing data
                    collection.remove( { }, true );
                        // or drop table - which is better?? need to research!!
                        // collection.drop();
    
                    var smpMonth;
                    var smpYear;
                    var smpDate;
                    var metricsDataLastUpdated = new Date();

                    // loop thru array to save all menu entries
                    var arrayLength = incidentArray.length;
                    for (var i = 0; i < arrayLength; i++) {
                        
                        // console.log('>>  ' + i + ' ___  ' + incidentArray[i].status);

                        // check row is not blank
                        //if ( incidentArray[i].hasOwnProperty("application") ){
                        if ( (typeof incidentArray[i].application === 'undefined') && (typeof incidentArray[i].allocatedDate === 'undefined')) {
                            // empty row, ignore
                        }
                        else {

                            // fiddle with SMP date
                            if (incidentArray[i].SMP.hasOwnProperty('result')){
                                smpMonth = incidentArray[i].SMP.result.getMonth() + 1;
                                smpYear = incidentArray[i].SMP.result.getFullYear();
                                smpDate = smpMonth + '/' + smpYear;
                            }
                            else {
                                if (incidentArray[i].SMP === null) {
                                    smpDate = '-';
                                } else {
                                    smpMonth = incidentArray[i].SMP.getMonth() + 1;
                                    smpYear = incidentArray[i].SMP.getFullYear();
                                    smpDate = smpMonth + '/' + smpYear;
                                }
                            }
                            
                            // make application name uppercase, if not null
                            if (typeof incidentArray[i].application === 'undefined'){
                                // don't convert!
                            }else{
                                incidentArray[i].application = incidentArray[i].application.toUpperCase().trim();
                            }

                            // insert new data set
                            collection.insert( 
                                { 
                                    application: incidentArray[i].application,
                                    allocatedDate: incidentArray[i].allocatedDate,
                                    incidentNumber: incidentArray[i].incidentNumber,
                                    incidentSeverity: incidentArray[i].incidentSeverity,
                                    reassigmentCode: incidentArray[i].reassigmentCode,
                                    problemType: incidentArray[i].problemType,
                                    arisingFromRelease: incidentArray[i].arisingFromRelease,
                                    briefDescription: incidentArray[i].briefDescription,
                                    smeName: incidentArray[i].smeName,
                                    resolutionSummary: incidentArray[i].resolutionSummary,
                                    status: incidentArray[i].status.toUpperCase().trim(),
                                    readOnlySQL: incidentArray[i].readOnlySQL,
                                    datafixViaInc: incidentArray[i].datafixViaInc,
                                    ticketTransferDate: incidentArray[i].ticketTransferDate,
                                    EffortInDays: incidentArray[i].EffortInDays,
                                    userErrorWTD: incidentArray[i].userErrorWTD,
                                    runningTime: incidentArray[i].runningTime,
                                    remarksNotes: incidentArray[i].remarksNotes,
                                    problemNumber: incidentArray[i].problemNumber,
                                    incidentClassification: incidentArray[i].incidentClassification,
                                    SMP: smpDate,
                                    metricsDataLastUpdated: metricsDataLastUpdated
                                } 
                            );

                        }    
                    }


                    var collection2 = db.collection('dataRollingSMPs');

                    // remove all existing data
                    collection2.remove( { }, true );

                    // loop thru array to save all entries
                    var arrayLength2 = rollingSMPsArray.length;
                    for (var j = 0; j < arrayLength2; j++) {
                        
                        // console.log('>>  ' + i + ' ___  ' + incidentArray[i].status);

                        // check row is not blank
                        //if ( incidentArray[i].hasOwnProperty("application") ){
                        if ( (typeof rollingSMPsArray[j].period === 'undefined') 
                            || (rollingSMPsArray[j].period === 'SERVICE MONITORING PERIODS') 
                            || (rollingSMPsArray[j].period === 'Period') ) {
                            // empty row, ignore
                        }
                        else {

                            // generate SMP
                            switch (rollingSMPsArray[j].month) {
                                case 'April':
                                    smpMonth = 1;
                                    break;
                                case 'May':
                                    smpMonth = 2;
                                    break;
                                case 'June':
                                    smpMonth = 3;
                                    break;
                                case 'July':
                                    smpMonth = 4;
                                    break;
                                case 'August':
                                    smpMonth = 5;
                                    break;
                                case 'September':
                                    smpMonth = 6;
                                    break;
                                case 'October':
                                    smpMonth = 7;
                                    break;
                                case 'November':
                                    smpMonth = 8;
                                    break;
                                case 'December':
                                    smpMonth = 9;
                                    break;
                                case 'January':
                                    smpMonth = 10;
                                    break;
                                case 'February':
                                    smpMonth = 11;
                                    break;
                                case 'March':
                                    smpMonth = 12;
                            }

                            smpYear = rollingSMPsArray[j].reportingYear.substring(0,4);
                            smpDate = smpMonth + '/' + smpYear;



                            // insert new data set
                            collection2.insert( 
                                { 
                                    period: rollingSMPsArray[j].period,
                                    month: rollingSMPsArray[j].month,
                                    start: rollingSMPsArray[j].start,
                                    end: rollingSMPsArray[j].end,
                                    weeks: rollingSMPsArray[j].weeks,
                                    reportingYear: rollingSMPsArray[j].reportingYear,
                                    SMP: smpDate
                                } 
                            );
                        }    
                    }



                    var collection3 = db.collection('dataProblems');

                    // remove all existing data
                    collection3.remove( { }, true );
                        // or drop table - which is better?? need to research!!
                        // collection.drop();
    

                    // loop thru array to save all menu entries
                    var arrayLength3 = problemArray.length;
                    for (var k = 0; k < arrayLength3; k++) {
                        
                        // console.log('>>  ' + i + ' ___  ' + incidentArray[i].status);

                        // check row is not blank
                        //if ( incidentArray[i].hasOwnProperty("application") ){
                        if ( (typeof problemArray[k].application === 'undefined')) {
                            // empty row, ignore
                        }
                        else {
                                                  
                            // make application name uppercase, if not null
                            if (typeof problemArray[k].application === 'undefined'){
                                // don't convert!
                            }else{
                                problemArray[k].application = problemArray[k].application.toUpperCase().trim();
                            }

                            var kaTargetDate;

                            if (typeof problemArray[k].kaTargetDate === 'undefined') {
                                kaTargetDate = '';
                            } else {
                                if (problemArray[k].kaTargetDate.hasOwnProperty('result')){
                                    kaTargetDate = problemArray[k].kaTargetDate.result;
                                } else {
                                    kaTargetDate = problemArray[k].kaTargetDate;
                                }
                            }

                            // insert new data set
                            collection3.insert( 
                                { 
                                    application: problemArray[k].application, 
                                    problemRaisedDate: problemArray[k].problemRaisedDate,
                                    kaTargetDate: kaTargetDate,
                                    problemNumber: problemArray[k].problemNumber,
                                    knownErrorReference: problemArray[k].knownErrorReference,
                                    severity: problemArray[k].severity,
                                    urgency: problemArray[k].urgency,
                                    problemType: problemArray[k].problemType,
                                    title: problemArray[k].title,
                                    smeName: problemArray[k].smeName,
                                    resolutionSummary: problemArray[k].resolutionSummary,
                                    status: problemArray[k].status.toUpperCase().trim(),
                                    fixAvailableDate: problemArray[k].fixAvailableDate,
                                    closedDate: problemArray[k].closedDate,
                                    incidentNumberSeverity: problemArray[k].incidentNumberSeverity,
                                    kaTaskIssued: problemArray[k].kaTaskIssued,
                                    kaTaskStatus: problemArray[k].kaTaskStatus,
                                    checkKBSubmissionStatus: problemArray[k].checkKBSubmissionStatus,
                                    kaVersion: problemArray[k].kaVersion,
                                    kaIssuedToDWP: problemArray[k].kaIssuedToDWP,
                                    kaIssuedToASL2: problemArray[k].kaIssuedToASL2,
                                    kaNumberHistorical: problemArray[k].kaNumberHistorical,
                                    validToDate: problemArray[k].validToDate,
                                    notes: problemArray[k].notes
                                } 
                            );

                        }    
                    }






                    db.close();
                    res.status(200).send({ message: 'INCIDENT_DATA_REFRESH_SUCCESSFUL'});
                });

            });

    });




// Get data from MongoDb into arrays ##################################################################

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
    
    router.post('/metricsIncidentsOpenGet', (req, res) => {
        req.user = req.body;

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('dataIncidents');

            collection.aggregate( [ { '$match': { status: 'OPEN' } }, {'$group' : {_id:'$application', count:{$sum:1}}}, {$sort:{'_id':1}} ] ).toArray((err, docs) => {
                
                // Check if data exist
                if ( docs.length === 0 ) {
                    // no incidents found
                    db.close();
                    res.status(200).send({ message: 'NO_OPEN_INCIDENTS'});

                } else {
                    var labelsChart1 = [];
                    var dataChart1 = [];
                    var backgroundColorChart1 = [];
                    var borderColorChart1 = [];
                    
                    var arrayLength = docs.length;
                    for (var i = 0; i < arrayLength; i++) {
                        labelsChart1.push(docs[i]._id);
                        dataChart1.push(docs[i].count);
                        // loop thru 10 colours - ie just get the 0 from 10, or 3 from 13 etc
                        var lastChari = i.toString();
                        lastChari = lastChari.substr(lastChari.length - 1);
                        backgroundColorChart1.push(chartColorsFill[lastChari]);
                        borderColorChart1.push(chartColorsBorder[lastChari]);

                    }

                    db.close();
                    res.status(200).send({ labelsChart1: labelsChart1, 
                                            dataChart1: dataChart1, 
                                            backgroundColorChart1: backgroundColorChart1, 
                                            borderColorChart1: borderColorChart1, 
                                            message: 'GET_SUCCESSFUL' });
                }
            });
        });
    });



    router.post('/metricsDataLastUpdatedGet', (req, res) => {
        req.user = req.body;
        //console.log('/login: ' + req.user.email + ', pw: ' + req.user.password);

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('dataIncidents');

            collection.find({}).toArray((err, docs) => {

                // Check if data exist
                if ( docs.length === 0 ) {
                    // no records returned - oops!
                    res.status(200).send({ message: 'NOT_SUCCESSFUL'});
                } else {

                    // calculate current SMP
                    var currentSMP;
                    var dateToday = new Date();
                    var collection2 = db.collection('dataRollingSMPs');

                    collection2.find( {  'start': {'$lte': dateToday}, 'end': {'$gte': dateToday} } ).toArray((err, docs2) => {
                        if ( docs2.length > 0 ) {
                            currentSMP = docs2[0].SMP;
                        }
                        res.status(200).send({ metricsDataLastUpdated: docs[0].metricsDataLastUpdated,
                                            currentSMP: currentSMP,
                                            message: 'GET_SUCCESSFUL' });
                    });
                }
            });
        });
    });




    router.post('/metricsIncidentsRaisedThisSMPGet', (req, res) => {
        req.user = req.body;

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('dataIncidents');

            var currentSMP;

            // calculate current SMP
            var dateToday = new Date();
            
            var collection2 = db.collection('dataRollingSMPs');

            collection2.find( {  'start': {'$lte': dateToday}, 'end': {'$gte': dateToday} } ).toArray((err, docs2) => {

                if ( docs2.length > 0 ) {
                    currentSMP = docs2[0].SMP;
                
                    // now search for incidents that match current SMP
                    collection.aggregate([ 
                        { '$match': { SMP: currentSMP } }, 
                        {'$group' : {_id:'$application', count:{$sum:1}}}, 
                        {$sort:{'_id':1}} 
                    ]).toArray((err, docs) => {
                        
                        // Check if data exist
                        if ( docs.length === 0 ) {
                            // no incidents found
                            db.close();
                            res.status(200).send({ message: 'NO_RAISED_INCIDENTS'});

                        } else {
                            var labelsChart3 = [];
                            var dataChart3 = [];
                            var backgroundColorChart3 = [];
                            var borderColorChart3 = [];
                            
                            var arrayLength = docs.length;
                            for (var i = 0; i < arrayLength; i++) {
                                labelsChart3.push(docs[i]._id);
                                dataChart3.push(docs[i].count);
                                // loop thru 10 colours - ie just get the 0 from 10, or 3 from 13 etc
                                var lastChari = i.toString();
                                lastChari = lastChari.substr(lastChari.length - 1);
                                backgroundColorChart3.push(chartColorsFill[lastChari]);
                                borderColorChart3.push(chartColorsBorder[lastChari]);

                            }

                            db.close();
                            res.status(200).send({ labelsChart3: labelsChart3, 
                                                    dataChart3: dataChart3, 
                                                    backgroundColorChart3: backgroundColorChart3, 
                                                    borderColorChart3: borderColorChart3, 
                                                    message: 'GET_SUCCESSFUL' });
                        }
                    });
                }
            });
        });
    });



    router.post('/metricsProblemsOpenGet', (req, res) => {
        req.user = req.body;

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('dataProblems');

            collection.aggregate( [ { '$match': { status: 'OPEN' } }, {'$group' : {_id:'$application', count:{$sum:1}}}, {$sort:{'_id':1}} ] ).toArray((err, docs) => {
                
                if ( docs.length === 0 ) {
                    // no problems found
                    db.close();
                    res.status(200).send({ message: 'NO_OPEN_PROBLEMS'});

                } else {
                    var labelsChart2 = [];
                    var dataChart2 = [];
                    var backgroundColorChart2 = [];
                    var borderColorChart2 = [];
                    
                    var arrayLength = docs.length;
                    for (var i = 0; i < arrayLength; i++) {
                        labelsChart2.push(docs[i]._id);
                        dataChart2.push(docs[i].count);
                        // loop thru 10 colours - ie just get the 0 from 10, or 3 from 13 etc
                        var lastChari = i.toString();
                        lastChari = lastChari.substr(lastChari.length - 1);
                        backgroundColorChart2.push(chartColorsFill[lastChari]);
                        borderColorChart2.push(chartColorsBorder[lastChari]);

                    }

                    db.close();
                    res.status(200).send({ labelsChart2: labelsChart2, 
                                            dataChart2: dataChart2, 
                                            backgroundColorChart2: backgroundColorChart2, 
                                            borderColorChart2: borderColorChart2, 
                                            message: 'GET_SUCCESSFUL' });
                }
            });
        });
    });




    router.post('/metricsProblemsRaisedThisSMPGet', (req, res) => {
        req.data = req.body;

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB

            // calculate current SMP
            var currentSMP;
            var smpStartDate;
            var smpEndDate;
            var dateToday = new Date();
            var collection = db.collection('dataRollingSMPs');

            collection.find( {  'start': {'$lte': dateToday}, 'end': {'$gte': dateToday} } ).toArray((err, docs) => {
                if ( docs.length > 0 ) {
                    currentSMP = docs[0].SMP;
                    smpStartDate = docs[0].start;
                    smpEndDate = docs[0].end;
                }

                var collection2 = db.collection('dataProblems');
              
                    // now search for problems that match current SMP
                    collection2.aggregate([ 
                        { '$match': { 'problemRaisedDate': {'$gte': smpStartDate} } }, 
                        {'$group' : {_id:'$application', count:{$sum:1}}}, 
                        {$sort:{'_id':1}} 
                    ]).toArray((err, docs2) => {
                        
                        // Check if data exist
                        if ( docs2.length === 0 ) {
                            // no problems found
                            db.close();
                            res.status(200).send({ message: 'NO_RAISED_PROBLEMS'});

                        } else {
                            var labelsChart4 = [];
                            var dataChart4 = [];
                            var backgroundColorChart4 = [];
                            var borderColorChart4 = [];
                            
                            var arrayLength = docs2.length;
                            for (var i = 0; i < arrayLength; i++) {
                                labelsChart4.push(docs2[i]._id);
                                dataChart4.push(docs2[i].count);
                                // loop thru 10 colours - ie just get the 0 from 10, or 3 from 13 etc
                                var lastChari = i.toString();
                                lastChari = lastChari.substr(lastChari.length - 1);
                                backgroundColorChart4.push(chartColorsFill[lastChari]);
                                borderColorChart4.push(chartColorsBorder[lastChari]);

                            }

                            db.close();
                            res.status(200).send({ labelsChart4: labelsChart4, 
                                                    dataChart4: dataChart4, 
                                                    backgroundColorChart4: backgroundColorChart4, 
                                                    borderColorChart4: borderColorChart4, 
                                                    message: 'GET_SUCCESSFUL' });
                        }
                    });
            });
        });
    });




    router.post('/metricsUserActivityIncidentsGet', (req, res) => {
        req.user = req.body;
        //console.log('/login: ' + req.user.email + ', pw: ' + req.user.password);

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB

            // calculate current SMP
            var currentSMP;
            var smpStartDate;
            var smpEndDate;
            var dateToday = new Date();

            var collection = db.collection('dataRollingSMPs');
            var collection2 = db.collection('dataIncidents');

            var userClosedMostIncidentsThisSMP = [];
            var userClosedMostIncidentsThisSMPCount;
            var userClosedMostIncidentsThisYear = [];
            var userClosedMostIncidentsThisYearCount;
            var usersClosedMostIncidentsAllTime;
            var closedIncidentsTotalCount = [];

            collection.find( {  'start': {'$lte': dateToday}, 'end': {'$gte': dateToday} } ).toArray((err, docs) => {
                if ( docs.length > 0 ) {
                    currentSMP = docs[0].SMP;
                    smpStartDate = docs[0].start;
                    smpEndDate = docs[0].end;
                }

                    // find user closed most incidents this SMP
                    collection2.aggregate([ 
                        {'$match': { status: 'CLOSED', 'ticketTransferDate': {'$gte': smpStartDate} } }, 
                        {'$group': { _id: '$smeName', count:{$sum:1}}}, 
                        {$sort:{'count': -1}},
                        // {$limit : 1 }
                    ]).toArray((err, docs2) => {
                        
                        // Check if data exist
                        if ( docs2.length === 0 ) {
                            // no incidents found
                            res.status(200).send({ message: 'NO_CLOSED_INCIDENTS'});

                        } else {
                            // get max count ( results ordered highest first)
                            var maxCount = docs2[0].count;

                            var arrayLength = docs2.length;
                            for (var i = 0; i < arrayLength; i++) {
                                if (docs2[i].count === maxCount){
                                    userClosedMostIncidentsThisSMP.push(docs2[i]._id);
                                }
                            }
                            userClosedMostIncidentsThisSMPCount = maxCount;
                        }
                    });

                    
                    var startYear = new Date('01/01/' + dateToday.getFullYear() );

                    // find user closed most incidents this year
                    collection2.aggregate([ 
                        {'$match': { status: 'CLOSED', 'ticketTransferDate': {'$gte': startYear} } }, 
                        {'$group' : {_id:'$smeName', count:{$sum:1}}}, 
                        {$sort:{'count': -1}},
                        // {$limit : 1 }
                    ]).toArray((err, docs2) => {
                        
                        // Check if data exist
                        if ( docs2.length === 0 ) {
                            // no problems found
                            res.status(200).send({ message: 'NO_CLOSED_INCIDENTS'});

                        } else {
                            // get max count ( results ordered highest first)
                            var maxCount = docs2[0].count;
                            
                            var arrayLength = docs2.length;
                            for (var i = 0; i < arrayLength; i++) {
                                if (docs2[i].count === maxCount){
                                    userClosedMostIncidentsThisYear.push(docs2[i]._id);
                                }
                            }
                            userClosedMostIncidentsThisYearCount = maxCount;
                        }
                    });

                        
                    // find top 3 users closed most incidents all time
                    collection2.aggregate([ 
                        {'$match': { status: 'CLOSED' } }, 
                        {'$group' : {_id:'$smeName', count:{$sum:1}}}, 
                        {$sort:{'count': -1}},
                        {$limit : 3 }
                    ]).toArray((err, docs2) => {
                        
                        // Check if data exist
                        if ( docs2.length === 0 ) {
                            // no problems found
                            res.status(200).send({ message: 'NO_CLOSED_INCIDENTS'});

                        } else {
                            usersClosedMostIncidentsAllTime = docs2;
                        }
                    });


                    // find top 3 users closed most incidents all time
                    // collection2.aggregate([ 
                    //     {'$match': { status: 'CLOSED' } }, 
                    //     {'$group' : {_id:'$smeName', count:{$sum:1}}}, 
                    //     {$sort:{'count': -1}},
                    //     {$limit : 3 }
                    // ]).toArray((err, docs2) => {

                    collection2.find({'status': 'CLOSED'}).toArray((err, docs2) => {
                        
                        // Check if data exist
                        if ( docs2.length === 0 ) {
                            // no problems found
                            res.status(200).send({ message: 'NO_CLOSED_INCIDENTS'});

                        } else {
                            closedIncidentsTotalCount = docs2.length;
                        }

                        db.close();
                        res.status(200).send({ userClosedMostIncidentsThisSMP: userClosedMostIncidentsThisSMP, 
                                            userClosedMostIncidentsThisSMPCount: userClosedMostIncidentsThisSMPCount,
                                            userClosedMostIncidentsThisYear: userClosedMostIncidentsThisYear,
                                            userClosedMostIncidentsThisYearCount: userClosedMostIncidentsThisYearCount,
                                            usersClosedMostIncidentsAllTime: usersClosedMostIncidentsAllTime,
                                            closedIncidentsTotalCount: closedIncidentsTotalCount,
                                            message: 'GET_SUCCESSFUL' });
                    });

            });
        });
    });












































//#######################################################################################################
// functions
//#######################################################################################################

// function listOpenIncidents(tmpArray) {
//     // count and list all open incidents, by application

//     var count = 0;
//     if(tmpArray[11] === 'Open') {
//         count++;
//         openIncidentsArray.push(tmpArray);

//     }
// }


function countItems (array, classifier) {
    return array.reduce(function(counter, item) {
        var p = (classifier || String)(item);
        counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
        return counter;
    }, {});
}

























































// ########################### Via route '/admin/...'
router.post('/requestAccess', (req, res) => {
        req.user = req.body;

        mongodb.connect(url, (err, db) => {
            if ( err ) {console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('users');

            // Check login details
            collection.find({'email': req.user.email}).toArray((err, docs) => {
                
                // Check if user exist
                if ( docs.length === 0 ) {
                    // User does not exist

                    // save details in db
                    collection.insert({'firstname': req.user.firstname, 'surname': req.user.surname, 'email': req.user.email, 'newUser': 1 }, (err,result) => {
                        console.log('User inserted');
                        db.close();
                        res.status(200).send({ message: 'REQUESTACCESS_CHECK_SUCCESSFUL'});
                    });

                } else {
                    // User does exist in system
                    db.close();
                    res.status(200).send({ message: 'REQUESTACCESS_CHECK_NOT_SUCCESSFUL'});
                }
            });
        });
    });









// ########################### Via route '/admin/...' ############################################################################################################
// NOT USED - (saved for example)
    router.post('/register', (req, res) => {
        req.user = req.body;
        //console.log('/register: ' + req.user.email + ', pw: ' + req.user.password);

        mongodb.connect(url, (err, db) => {
            if ( err ) { console.log('Error connecting to mongoDB', err); return; }
            // Connected to DB
            var collection = db.collection('users');
            collection.find({'email': req.user.email }).count( (err,count) => {

                // Check if email already registered
                if ( count === 0 ) {
                    // Email not registred, generate hash and save in DB

                    // Generate Salt for encrypted pw
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) {return(err);}

                        // From plain text req.user.password create 
                        // hashed password (encrypted password) to save in DB
                        bcrypt.hash(req.user.password, salt, null, (err, hash) => {
                            if (err) {return (err);}

                            // Add new user to DB with hashed password
                            collection.insert({'firstname': req.user.firstname, 'surname': req.user.surname, 'email': req.user.email, 'password': hash }, (err,result) => {
                                console.log('User inserted');
                                db.close();
                                res.status(200).send({ message : 'REGISTRATION_SUCCESSFUL'});
                            });
                        });
                    });

                } else {
                    console.log('Email already exist');
                    db.close();
                    res.status(200).send({ message : 'USER_ALREADY_EXIST'});
                }

            });
        });
    });
//##################################################################################################################################################################





// Export so route methods available outside
module.exports = router;

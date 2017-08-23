
var xml2js = require('xml2js');
var parser = xml2js.Parser({explicitArray: false});

var http = require('http');
var express = require('express'); 
var app = express();

var mongodb = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/capgeminiNewcastleApp';
var ObjectId = require('mongodb').ObjectID;

var bodyParser = require('body-parser');
var adminRoute = require('./routes/admin');

var nodemailer = require('nodemailer');

var Excel = require('exceljs');

// var moment = require('moment');


// var is = require( 'validator.js' ).Assert;
// var validator = require( 'validator.js' ).validator();


//var expressJWT = require('express-jwt');
//var jwt = require('jsonwebtoken');

app.use(bodyParser.json());
//app.use(expressJWT({ secret: 'will this work' }).unless({ path: ['/login'] }));

// Permissions for Get/Put/Post/Delete from browser
app.use( (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Use adminRoute module to handle /admin calls
app.use('/admin', adminRoute );


// Where to find images and web pages
app.use(express.static('app'));
app.set('views', __dirname + '/app/views');

app.get('/', (req, res) => {
    console.log('here');
    res.sendFile(__dirname + '/app/views/index.html');
});



                                


// app.get('/allBooks', (req,res) => {
// 	mongodb.connect(url, (err, db) => {
// 		if ( err ) {
// 			console.log('Error connecting to mongoDB', err);
// 			return;
// 		}
// 		// Connected to DB
// 		var collection = db.collection('books');

// 		collection.find()
// 			.toArray((err, docs) => {
// 			//console.log(docs);
// 			db.close();
// 			res.json(docs);
// 		});
// 	});
// });

app.listen(4000, () => { 
	console.log('listening on 4000');
});

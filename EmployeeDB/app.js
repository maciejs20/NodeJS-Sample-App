/**
 * Module dependencies.
 */

const express = require('express')
const routes = require('./routes')
const user = require('./routes/user')
const http = require('http')
const path = require('path')
const EmployeeProvider = require('./employeeprovider').EmployeeProvider;
const errorhandler = require('errorhandler');
const  morgan = require('morgan');
const bodyParser = require("body-parser");

var app = express();

// mongodb port
var employeeProvider= new EmployeeProvider('localhost', 27017);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));
app.use( require('request-param')() )
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes

//index
app.get('/', function(req, res){
  employeeProvider.findAll(function(error, emps){
      res.render('index', {
            title: 'Employees',
            employees:emps
        });
  });
});

//new employee
app.get('/employee/new', function(req, res) {
    res.render('employee_new', {
        title: 'New Employee'
    });
});

//save new employee
app.post('/employee/new', function(req, res){
    console.log(req.params);
    employeeProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

//update an employee
app.get('/employee/:id/edit', function(req, res) {
	employeeProvider.findById(req.param('_id'), function(error, employee) {
		res.render('employee_edit',
		{ 
			title: employee.title,
			employee: employee
		});
	});
});

//save updated employee
app.post('/employee/:id/edit', function(req, res) {
	employeeProvider.update(req.param('_id'),{
		title: req.param('title'),
		name: req.param('name')
	}, function(error, docs) {
		res.redirect('/')
	});
});

//delete an employee
app.post('/employee/:id/delete', function(req, res) {
	employeeProvider.delete(req.param('_id'), function(error, docs) {
		res.redirect('/')
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
 res.send('<h1> Page not found </h1>');
});

app.listen(process.env.PORT || 3000);

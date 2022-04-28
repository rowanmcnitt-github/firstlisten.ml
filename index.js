var express = require('./node_modules/express');
var app = express();
var testResp = require('C:/Users/ilove/Desktop/CSE526_Project/CSE526/src/js/test_resp.json');
var favicon = require('serve-favicon')
path = require('path');
// app.use(express.static('favicon.ico'));
// app.use(express.favicon("src/favicon.ico"));
app.use(express.static('src')); 
app.use(favicon(path.join(__dirname, 'src', 'favicon.ico')))
// app.use('/favicon.ico', express.static('src/favicon.ico'));
//
app.get('/', function (req, res) {
  res.render('index.html');
});

if (typeof localStorage === "undefined" || localStorage === null) {
  LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./src');
}

app.listen(3001, function () {
  console.log('AuralNet Running on Port: 3001');
});
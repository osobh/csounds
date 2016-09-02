var express = require('express');
var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/callback', function (req, res) {
	console.log(req.query);
  res.render('callback');
});

app.get('/mylist', function (req, res) {
  res.render('mylist');
});

app.get('/roulette', function (req, res) {
  res.render('roulette');
});

app.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port 5000!');
});
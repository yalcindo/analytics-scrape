
/**
 * Module dependencies.
 */
var fs = require('fs');
var request=require("request");
var cheerio=require("cheerio");
var writeStream = fs.createWriteStream("file.csv");
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

writeStream.write('Firm,' + 'Action'+'Company,'+'Ranking,'+'Price Ranking' + '\n');

request("http://www.analystratings.net/ratings/USA/12-18-2013/",function(err,response,body)
{
  if (!err && response.statusCode == 200) {
    // console.log(body) 
    $ =cheerio.load(body);
  
   $("#ratingstable tbody tr").each(function(i,el){
	    var getByIndex=$(this).children();
	    var firm=getByIndex.eq(0).text();
	    var action=getByIndex.eq(1).text();
	    var company=getByIndex.eq(2).text();
	    var ranking=getByIndex.eq(3).text();
	    var priceRanking=getByIndex.eq(4).text();

	    writeStream.write(firm+ ',' + action +','+company+','+ranking+','+priceRanking+'\n');
    });

   
   

    
  }

});




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/**
 * Module dependencies.
 */
var fs = require('fs');
var request=require("request");
var cheerio=require("cheerio");
var writeStream = fs.createWriteStream("file.csv");
var http = require('http');
var path = require('path');

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



var express = require('express');
var app = express();

app.use(express.json() );       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
  extended: false
})); 
//These three lines below are for importing the JSON file to get the value.
const fs = require('fs');
let rawdata = fs.readFileSync('book.json');
let bookJSON = JSON.parse(rawdata);
//This is the array for JSON objects
var books = [
  {'book': '<b>Title: </b>'+bookJSON["book1"]["title"]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Author: </b>'+bookJSON["book1"]["author"]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Publisher: </b>'+bookJSON["book1"]["publisher"]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date: </b>'+bookJSON["book1"]["date"]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Website: </b>'+bookJSON["book1"]["website"]+'<br>'},
  {'book': '<b>Title: </b>'+bookJSON["book2"]["title"]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Author: </b>'+bookJSON["book2"]["author"]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Publisher: </b>'+bookJSON["book2"]["publisher"]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date: </b>'+bookJSON["book2"]["date"]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Website: </b>'+bookJSON["book2"]["website"]+'<br>'},
  {'book': '<b>Title: </b>'+bookJSON["book3"]["title"]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Author: </b>'+bookJSON["book3"]["author"]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Publisher: </b>'+bookJSON["book3"]["publisher"]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date: </b>'+bookJSON["book3"]["date"]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Website: </b>'+bookJSON["book3"]["website"]+'<br>'},
]

app.get('/', function(req, res){ //Main Page

  //Code below is where contents get printed out in HTML.
  res.send('<!DOCTYPE html><html lang="en-US"><head><meta charset="UTF-8"><title>Naushad Sayeed Book Inventory App</title></head><body><h1 style="text-align:center">Naushad Sayeed Book Inventory App</h1><h2 style="text-align:center"><a href="/bookinventory/list">Click here to view list!</a></h2></body></html>')
  //res.send(JSON.stringify({title:"value"}));
});

app.get('/bookinventory/list', function(req, res){ //List Page

   var html = '<p>'
   for (var i = 0; i < books.length; i++) {
      html = html + books[i].book + '<br>'; //The ".book" at the end makes 'book' the key value so on the books array, it uses 'book' on the left (e.g. book : test1)
    }
    html += '</p>'
  //Code below is where contents get printed out in HTML.
   res.send('<!DOCTYPE html><html lang="en-US"><head><meta charset="UTF-8"><title>List | Naushad Sayeed Book Inventory</title></head><body><h2 style="text-align:center">Naushad Sayeed Book Inventory App</h2><h3>List of books:</h3> ' + html+ '<a href="/bookinventory/add">Add a new book</a></body></html> ');
});


app.get('/bookinventory/add', function(req, res){ //Add book Page

  var titleBox = '<form action="/bookinventory/addbook" method="post"><label for="titleLabel">Title:</label><br><input type="text" id="titleLabel" name="titleLabel"><br>'
  var authorBox ='<label for="authorLabel">Author:</label><br><input type="text" id="authorLabel" name="authorLabel"><br>'
  var publisherBox = '<label for="publisherLabel">Publisher:</label><br><input type="text" id="publisherLabel" name="publisherLabel"><br>'
  var dateBox = '<label for="dateLabel">Date:</label><br><input type="text" id="dateLabel" name="dateLabel"><br>'
  var websiteBox = '<label for="websiteLabel">Website:</label><br><input type="text" id="websiteLabel" name="websiteLabel"><br><input type="submit" value="Submit"><br></form>'
  //Code below is where contents get printed out in HTML.
  res.send('<!DOCTYPE html><html lang="en-US"><head><meta charset="UTF-8"><title>Add Book | Naushad Sayeed Book Inventory</title></head><body><h2 style="text-align:center">Naushad Sayeed Book Inventory App</h2><h3>Add a Book:</h3> ' +  titleBox + authorBox + publisherBox + dateBox + websiteBox + '</body></html>');
});

app.post('/bookinventory/addbook', function(req, res){ //Page that views the book just added.

  console.log(req.body);
  var new_book = '<b>Title: </b>'+req.body.titleLabel+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Author: </b>'+req.body.authorLabel+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Publisher: </b>'+req.body.publisherLabel+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date: </b>'+req.body.dateLabel+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Website: </b>'+req.body.websiteLabel+'<br>'
  var new_json = {'book': new_book};
  books.push(new_json);
  //Code below is where contents get printed out in HTML.
  res.send('<!DOCTYPE html><html lang="en-US"><head><meta charset="UTF-8"><title>Add Book | Naushad Sayeed Book Inventory</title></head><body><h2 style="text-align:center">Naushad Sayeed Book Inventory App</h2>The book <b>' + req.body.titleLabel+ '</b> and its information is added!<br> <a href="/bookinventory/list">list of books</a></body></html>');
}

);


app.listen(80); //Port 80 is default port
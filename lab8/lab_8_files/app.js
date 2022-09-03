var express = require('express');
var app = express();

app.use(express.json() );       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
  extended: false
})); 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://naushad_sayeed:naushadmedialab123@cluster0.pyrcn.mongodb.net/mydb?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//Code below for connecting with database and inserting the books in.
client.connect(err => {
  const collection = client.db("ryerson").collection("books");
  var docs = [
    { title: "The Giver", author: "Lois Lowry", publisher: "Houghton Mifflin",  date: "1993", website: "https://en.wikipedia.org/wiki/The_Giver"},
    { title: "Harry Potter", author: "J. K. Rowling", publisher: "Bloomsbury Publishing",  date: "26 June 1997", website: "https://en.wikipedia.org/wiki/Harry_Potter"},
    { title: "Captain Underpants", author: "Dav Pilkey", publisher: "Scholastic",  date: "September 1, 1997", website: "https://en.wikipedia.org/wiki/Captain_Underpants"},
    { title: "Pokémon Adventures", author: "Hidenori Kusaka", publisher: "Shogakukan",  date: "March 1997", website: "https://en.wikipedia.org/wiki/Pok%C3%A9mon_Adventures"},
    { title: "Spider-Man", author: "Stan Lee and Steve Ditko", publisher: "Marvel Comics",  date: "August 1962", website: "https://en.wikipedia.org/wiki/Spider-Man"}
  ];

  collection.insertMany(docs, function(err, res) {
    if (err) throw err;
    console.log("Books inserted to database! Go to website with browser.");
    client.close();
  });
});

app.get('/', function(req, res){ //Main Page

  //Code below is where contents get printed out in HTML.
  res.send('<!DOCTYPE html><html lang="en-US"><head><meta charset="UTF-8"><title>Naushad Sayeed Book Inventory App</title></head><body><h1 style="text-align:center">Naushad Sayeed Book Inventory App</h1><h2 style="text-align:center"><a href="/bookinventory/list">Click here to view list!</a></h2></body></html>')
  //res.send(JSON.stringify({title:"value"}));
});

app.get('/bookinventory/list', function(req, res){ //List Page
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ryerson");
    //Find all documents in the books collection:
    dbo.collection("books").find({}).toArray(function(err, result) {
      if (err) throw err;
      var html = '<p>'
      for (var i = 0; i < result.length; i++) {
         html = html + '<b>Title: </b>'+result[i]['title']+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Author: </b>'+result[i]['author']+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Publisher: </b>'+result[i]['publisher']+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Date: </b>'+result[i]['date']+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Website: </b>'+result[i]['website']+'<br>';
       }
       html += '</p>'
       //Code below is where contents get printed out in HTML.
       res.send('<!DOCTYPE html><html lang="en-US"><head><meta charset="UTF-8"><title>List | Naushad Sayeed Book Inventory</title></head><body><h2 style="text-align:center">Naushad Sayeed Book Inventory App</h2><h3>List of books:</h3> ' + html+ '<a href="/bookinventory/add">Add a new book</a></body></html> ');
      db.close();
    });
  });
  
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
  //Code below for connecting with database and inserting the books in.
  client.connect(err => {
    const collection = client.db("ryerson").collection("books");
    var docs = [
      { title: req.body.titleLabel, author: req.body.authorLabel, publisher: req.body.publisherLabel,  date: req.body.dateLabel, website: req.body.websiteLabel}
    ];

    collection.insertMany(docs, function(err, res) {
      if (err) throw err;
      console.log("Books inserted to database! Go to website with browser.");
      client.close();
    });
  });
  //Code below is where contents get printed out in HTML.
  res.send('<!DOCTYPE html><html lang="en-US"><head><meta charset="UTF-8"><title>Add Book | Naushad Sayeed Book Inventory</title></head><body><h2 style="text-align:center">Naushad Sayeed Book Inventory App</h2>The book <b>' + req.body.titleLabel+ '</b> and its information is added!<br> <a href="/bookinventory/list">list of books</a></body></html>');
}

);


app.listen(80); //Port 80 is default port
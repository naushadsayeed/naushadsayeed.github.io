var express = require('express');
var app = express();
const request = require("request") //This is important for getting the API with request
app.use(express.json() );       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
  extended: false
})); 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://naushad_sayeed:naushadmedialab123@cluster0.pyrcn.mongodb.net/mydb?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

var fs = require('fs');
const { get } = require('express/lib/response');

/*The line below requires "npm install alert" in the Terminal/Command*/
let alert = require('alert'); 

//This is for active users who are logged in
var active = false;
var active_user_fullname = ""; //Initializes the variable that saves full name for logged in user to print

//These three global variables are for printing the information with pictures when words is entered..
var wordValue = "";
var def = "";
var def1Value = "";
var def2Value = "";
var getPicture = "";
var user_searched_word = "";

app.get('/', function(req, res){ //Main Page
  if(active==false){
    res.redirect('/login');
  }
  if(active==true){
    res.redirect('/main');
  }
});

app.get('/login', function(req, res){ //Goes to login page.
  active=false;
  console.log("Active = "+active);

  //The 6 lines below is there because it can clear everything in the main page after logging out.
  wordValue = "";
  def = "";
  def1Value = "";
  def2Value = "";
  getPicture = "";
  user_searched_word = "";
  
  active_user_fullname = "";
  fs.readFile('./views/login.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

app.post('/login', function (req, res, next) { //Gets the info from the login form.
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ryerson");
    //Find all documents in the books collection:
    dbo.collection("users").find({}).toArray(function(_err, result) {
      //if (err) throw err;
      //var html = '';
      for (var i = 0; i < result.length; i++) {
        //html=html+result[i]['full_name'];
        if((result[i]['email_address'].toUpperCase() == req.body.login_uname_email.toUpperCase() || result[i]['username'].toUpperCase() == req.body.login_uname_email.toUpperCase()) && result[i]['password']==req.body.login_password){
            active=true;
            console.log("Active = "+active);
            active_user_fullname=result[i]['full_name'] //Gets the full name from an array   
            res.redirect('/main'); //Goes to the main page.
        }
       }
       if(active==false){
        //The line below requires the line "let alert = require('alert');"
        alert("Incorrect username/email or password!");
       }
      db.close();
    });
  });
});

app.get('/signup', function(req, res){ //Goes to signup page.
  active=false;
  console.log("Active = "+active);
  active_user_fullname = "";
  fs.readFile('./views/signup.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

app.post('/signup', function (req, res, next) { //Gets the info from the signup form.
  client.connect(err => {
    const collection = client.db("ryerson").collection("users");
    var users = [
      { full_name: req.body.fullname, email_address: req.body.email, username: req.body.uname,  password: req.body.psw}
    ];

    collection.insertMany(users, function(err, res) {
      if (err) throw err;
      //console.log("Users inserted to database! Go to website with browser.");
      client.close();
    });
    res.redirect('/signup_finished');
  });
});

app.get('/signup_finished', function(req, res){ //Goes to page that confirms if signup is complete.
  fs.readFile('./views/signup_finished.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

app.get('/main', function(req, res){ //Goes to main page.
  if(active==false){
    res.redirect('/login');
  }
  if(active==true){
    var main_html_1 = "<!DOCTYPE html><html lang='en-US'><head><meta name='viewport' content='width=device-width, initial-scale=1'><meta charset='UTF-8'><title>Naushad Sayeed Dictionary Website</title><link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'><style>body{font-family: Arial, Helvetica, sans-serif; background-color: #ccffff;}/*form{border: 3px solid #000000;background-color: #f1f1f1;}*/ul{list-style-type: none; margin: 0; padding: 0; overflow: hidden; background-color: #333;}li{float: left;}li a{display: block; color: white; text-align: center; padding: 14px 16px; text-decoration: none;}li a:hover:not(.main){background-color: rgb(255, 2, 2);}.logout{background-color: #aa0404;}form{text-align: center;}input[type='text']{height: 50px;width: 600px;background: #e7e7e7;font-family: 'Nunito', sans-serif;font-weight: bold;font-size: 20px;border: none;border-radius: 2px;padding: 10px 10px;}input[type='submit']{height: 50px;width: 100px;background: #e7e7e7;font-family: 'Nunito', sans-serif;font-weight: bold;font-size: 20px;border: none;border-radius: 2px;}</style></head><body> <ul> <li style='text-align:center; color:white;'><a class='main' href='#'><b>Naushad Sayeed Dictionary Website</b></a></li><li style='float:right'><a class='logout' href='/login'><i class='fa fa-fw fa-user'></i>Logout</a></li><li style='float: right;'><a class='main' href='#'>"
    var main_html_2 = active_user_fullname+"</a></li></ul> <h2 style='text-align:center'>You can now use this website to search for a word and find its definition!</h2> <form method='post' action='/main' > <input type='text' placeholder='ENTER A WORD HERE TO SEARCH' name='enter_word' required> <input type='submit' value='Submit' class='button' id='submit'> </form></body></html>"
    res.write(main_html_1+main_html_2);
    res.write(user_searched_word);
    res.write("<h2 class='word' style='text-align:center'>"+wordValue+"</h2>")
    res.write(def)
    res.write("<h4>"+def1Value+"</h4>")
    res.write("<h4>"+def2Value+"</h4>")
    res.write(getPicture)
  }
});

app.post('/main', function (req, res, next) { //Gets the word from the main page.
  console.log("Word entered = "+req.body.enter_word) 
  //The variable below is for the whole URL for the API with the selected word.
  let API_URL = 'https://dictionaryapi.com/api/v3/references/collegiate/json/'+req.body.enter_word+'?key=c5baf3db-84cc-4386-93fe-9da6c9a194dc';
  var searchedWord = false; //This is to check if the word is already searched.
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ryerson");
    //Find all documents in the books collection:
    dbo.collection("searches").find({}).toArray(function(_err, result) {
      for (var i = 0; i < result.length; i++) {
        //html=html+result[i]['full_name'];
        if((result[i]['selected_word'].toUpperCase() == req.body.enter_word.toUpperCase())){
            searchedWord = true;
            user_searched_word = "<h4 style='text-align:center'>This word was searched by "+result[i]['user_who_searched']+"</h4>";
            wordValue=result[i]['selected_word'];
            def = "<h3>Definition</h3>";
            def1Value = "1. "+result[i]['definition_1'];
            def2Value = "2. "+result[i]['definition_2'];
            getPicture = result[i]['picture'];
            res.redirect('/main'); //Goes to the main page.
        }
       }
       if(searchedWord==false){
        user_searched_word = ""; //If the "searchedWord" equals to false, then it won't print out that the word was searched by anyone.
        //The line below requires the line "let alert = require('alert');"
        //The request function below requires the "const request" on line 3
        request(API_URL, function(err, response, body) {
          let word = JSON.parse(body); //The variable 'word' is the same as data from the API which puts it in an array.
          if (word.length == 0) { //If the length of this array is '0' that means the word can't be found.
              //The line below requires the line "let alert = require('alert');"
              alert("Unable to find word!")
          } else {
              wordValue = word[0]['hwi']['hw']; 
              def = "<h3>Definition</h3>";
              def1Value = "1. "+word[0]['def'][0]['sseq'][0][0][1]['dt']; 
              def2Value = "2. "+word[0]['def'][0]['sseq'][0][1][1]['dt'];

              srcURL = "https://www.merriam-webster.com/assets/mw/static/art/dict/"+wordValue+".gif";
              getPicture = "<img src="+srcURL+" alt='Image not found'"
              try {  
                  var data = fs.readFileSync('./views/NoImageAvailable.txt', 'utf8');
                  getPicture += data.toString();
                  //console.log(getPicture.toString()); //This was to check if 'getPicture' variable has the right value.   
              } catch(e) {
                  console.log('Error:', e.stack);
              }
              client.connect(err => {
                const collection = client.db("ryerson").collection("searches");
              var wordsSearched = [
                { selected_word: wordValue, definition_1: def1Value, definition_2: def2Value, picture: getPicture, user_who_searched: active_user_fullname}
              ];
          
              collection.insertMany(wordsSearched, function(err, res) {
                if (err) throw err;
                //console.log("Users inserted to database! Go to website with browser.");
                client.close();
              });
            });
              res.redirect('/main'); //This updates the app.get ('/main', .....)
              
          }
        });  
       }
      db.close();
    });
});
}) 
app.listen(80);/*Port 80 is default port*/
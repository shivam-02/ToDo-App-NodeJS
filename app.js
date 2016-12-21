var express=require('express');
var todoController=require('./controllers/todoController');

var app=express();


//set up template engine
app.set('view engine','ejs');

//for static files
app.use(express.static('./public'));

//fire controller
todoController(app);

//listen to port
app.listen(4000);
console.log("Listening on 4000...");

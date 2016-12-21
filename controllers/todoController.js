var bodyParser=require('body-parser');
var mongodb=require('mongodb');
//url to mongo database server
var url = 'mongodb://localhost:27017/test';

//local array for ui
var items=[];
// for post methods to parse body
var urlencodedParser=bodyParser.urlencoded({extended:false});



var addItem=function(db,callback,item){
  db.collection('todos').insertOne({"item":item},function(err, result) {

    console.log("Inserted a document into the todos collection.");
    callback();
  });

};

var getItems=function(db,callback){
  items=[];

  var cursor=db.collection('todos').find();
  cursor.each(function(err,doc){

    if(doc!=null)
    {

    items.push(doc);


  }
  else {
         callback();
      }
  });

};
var deleteItem=function(db,callback,item){
  db.collection('todos').deleteOne({"item":item},function(err, result) {

    console.log("Deleted a document into the todos collection.");
    callback();
  });

};
//var data=[{item:'Get milk'},{item:'walk dog'},{item:'do some coding'}];



module.exports=function(app){

app.get('/todo',function(req,res){

  mongodb.MongoClient.connect(url, function(err, db) {

    console.log("Connected correctly to server.");

    getItems(db,function(){
      console.log(items);
      res.render('todo',{todos:items});
      console.log('getItems callback');

    });

  });





});

app.post('/todo',urlencodedParser,function(req,res){
  mongodb.MongoClient.connect(url, function(err, db) {

    console.log("Connected correctly to server.");
    var item=req.body.item;
    addItem(db,function(){

      res.json(items);
      console.log('addItem callback');
    },item);
   });

});

app.delete('/todo/:item',function(req,res){

  mongodb.MongoClient.connect(url, function(err, db) {

    console.log("Connected correctly to server.");
    var item=req.params.item.replace(/-/g," ");
    deleteItem(db,function(){

      items=items.filter(function(todo){

        return todo.item.replace(/ /g, "-")!==req.params.item;
      });
    res.json(items);
      console.log('delteItem callback');
    },item);


   });


});

};

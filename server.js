// packages
var express=require("express");
var app=express();
var morgan=require("morgan");
var mongoose=require("mongoose");
var port=process.env.PORT || 8000;
var router=express.Router();
var bodyParser=require("body-parser");
var appRoutes=require('./app/routes/api')(router);
var path=require("path");
var passport=require('passport');
var social=require('./app/passport/passport')(app,passport);




// middle-wares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.use('/api',appRoutes);




// mongodatabase-connection
mongoose.connect("mongodb://localhost:27017/tutorial",function(err){
	if(err){
		console.log("Not connected to db"+err);
	}
	else{
		console.log("Connected to db");
	}
});



app.get('*',function(req,res){
	res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
});




// server-port
app.listen(port,function(){
	console.log("running on port"+port);
});
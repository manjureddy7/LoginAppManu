// . represents going to parent directory .. represents going bak it main parent
var User=require('../models/user');
var jwt = require('jsonwebtoken');
var secret="harrypotter";
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');


module.exports=function(router){



		var options = {
		  auth: {
		    api_user: 'meanstackman',
		    api_key: 'PAssword123!@#'
		  }
		}

		var client = nodemailer.createTransport(sgTransport(options));

	

	// remember everytime if ur creating or posting data into database always use post
	// User Registartion
	router.post('/users',function(req,res){
		var user=new User();
		user.username=req.body.username;
		user.password=req.body.password;
		user.email=req.body.email;
		user.name=req.body.name;
		user.temporarytoken=jwt.sign({ username:user.username,email:user.email },secret,{ expiresIn:'24h' });

		if(req.body.username==null || req.body.username==" " || req.body.password==null || req.body.password==" " || req.body.email==null || req.body.email==" " || req.body.name==null || req.body.name==" " ){
			
			res.json({success:false,message:'Please provide all details'})
		}else{
			user.save(function(err){
				if(err){

					if(err.errors != null){

						if(err.errors.name){
						 res.json({success:false,message:err.errors.name.message})
					    }
					    else if(err.errors.email){
					    	res.json({success:false,message:err.errors.email.message})
					    }
					    else if(err.errors.username){
					    	res.json({success:false,message:err.errors.username.message})
					    }
					    else if(err.errors.password){
					    	res.json({success:false,message:err.errors.password.message})
					    }else{
					    	res.json({success:false,message:err})
					    }
					}else if(err){
						if(err.code == 11000){
							if(err.errmsg[61]=="u"){
								res.json({success:false,message:"Username already taken"})
							}else if(err.errmsg[61]=="e"){
								res.json({success:false,message:"Email already taken"})
							}
							
						}else{
							res.json({success:false,message:err})
						}
					}
				}
				else{
						  var email = {
						  from: 'Localhost Staff,staff@localhost.com',
						  to: user.email,
						  subject: 'Localhost Activation Link',
						  text: 'Hello ' + user.name + ' Please Click on the activation link:http://localhost:8000/activate/' +user.temporarytoken ,
						  html: 'Hello <strong>' + user.name + '</strong>,<br><br> Please Click on the activation link:<br><br><a href="http://localhost:8000/activate/' +user.temporarytoken +'"> HERE </a>'
						};

						client.sendMail(email, function(err, info){
						    if (err ){
						      console.log(err);
						    }
						    else {
						      console.log('Message sent: ' + info.response);
						    }
						});


					res.json({success:true,message:'Account Registered..! Please check your email for activation link'})
				}
			});
		}
	});

// Checking username
	router.post('/checkuname',function(req,res){
		User.findOne({username:req.body.username}).select('username').exec(function(err,user){
			if(err) throw err;

			if(user){
				res.json({success:false,message:'That username is already taken'});
			}else{
				res.json({success:true,message:'Valid username'});
			}
			});
	});
	

	// Checking Email
	router.post('/checke',function(req,res){
		User.findOne({email:req.body.email}).select('email').exec(function(err,user){
			if(err) {throw err};
			if(user){
				res.json({success:false,message:'That email already taken'});
			}else{
				res.json({success:true,message:'Valid email'});
			}
		});
});

// User Login Route
	router.post('/authenticate',function(req,res){
		User.findOne({username:req.body.username}).select('email username password').exec(function(err,user){
			if(err) throw err;
			
			if(!user){
				res.json({success:false,message:'Could not authenticate user'});
			}else if(user){

				if(req.body.password) {
					var validPassword=user.comparePassword(req.body.password);
				}else{
					res.json({success:false,message:"No password provided"});
				}
				
				if(!validPassword){
					res.json({success:false,message:"Could not authenticate password"});
				}else{
					var token=jwt.sign({ username:user.username,email:user.email },secret,{ expiresIn:'24h' });
					res.json({success:true,message:"User Authenticated",token:token});
				}
			}

		});
	});

	router.put('/activate/:token',function(req,res){
		User.findOne({ temporarytoken:req.params.token },function(err,user){
			if(err) throw err;
			var token=req.params.token;


			jwt.verify(token, secret, function(err, decoded) {
			 if(err){
			 	res.json({success:false,message:"Activation link has expired"})
			 }
			 else if(!User){
			 	res.json({success:false,message:"Activation link has expired"})
			 }else{

			 	user.temporarytoken=false;
			 	user.active=true;

			 	user.save(function(err){
			 		if(err){
			 			console.log(err);
			 		}
			 		else{


			 			  var email = {
						  from: 'Localhost Staff,staff@localhost.com',
						  to: user.email,
						  subject: 'Localhost Account activated',
						  text: 'Hello ' + user.name + ' Your Account has been successfully activated ' ,
						  html: 'Hello <strong>' + user.name + '</strong>,<br><br> Account has been successfully activated'
						};

						client.sendMail(email, function(err, info){
						    if (err ){
						      console.log(err);
						    }
						    else {
						      console.log('Message sent: ' + info.response);
						    }
						});
			 		}
			 	});


			 	res.json({success:true,message:"Activation activated"})
			 }
			});

		});
	});


	// creating a middleware to decode token
	router.use(function(req,res,next){

		var token = req.body.token || req.body.query || req.headers['x-access-token'];

		if(token){
			// verify a token symmetric
			jwt.verify(token, secret, function(err, decoded) {
			 if(err){
			 	res.json({success:false,message:"Invalid token..!!"})
			 }
			 else{
			 	req.decoded=decoded;
			 	next();
			 }
			});

		}
		else{
			// no token provided
			res.json({success:false,message:"No token provided..!!"})
		}
	});


	router.post('/me',function(req,res){
		res.send(req.decoded);
	});

	return router;
}




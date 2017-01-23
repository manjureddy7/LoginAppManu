var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var bcrypt=require("bcrypt-nodejs");
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');


var nameValidator = [
	  validate({
		  validator: 'matches',
		  arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
		  message:"Name must be 3 characters,No spl characters,must have space btw name"
	  }),
	   validate({
	  validator: 'isLength',
	  arguments: [3, 20],
	  message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

var emailValidator = [
	  validate({
		  validator: 'isEmail',
		  
		  message:"Not a valid e-mail..!!"
	  }),

	  validate({
	  validator: 'isLength',
	  arguments: [3, 50],
	  message: 'email should be between {ARGS[0]} and {ARGS[1]} characters'
	})

];

var usernameValidator = [
	  validate({
	  validator: 'isLength',
	  arguments: [3, 50],
	  message: 'username should be between {ARGS[0]} and {ARGS[1]} characters'
	}),
	validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'username should contain letters and numbers only'
  })
];

var passwordValidator = [
	  validate({
		  validator: 'matches',
		  arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,30}$/,
		  message:" password must have lowercase,uppercase,number and spl charcters"
	  }),
	   validate({
	  validator: 'isLength',
	  arguments: [8, 30],
	  message: 'password should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];



var userSchema=new Schema({
	name:{type:String,required:true,validate: nameValidator},
	username:{type:String,required:true,unique:true,validate:usernameValidator},
	password:{type:String,required:true,validate:passwordValidator},
	email:{type:String,required:true,unique:true,validate: emailValidator},
	active:{type:Boolean,required:true,default:false},
	temporarytoken:{type:String,required:true}
});

// saving before encrypting
userSchema.pre('save', function(next) {
	var user=this;
	bcrypt.hash(user.password,null,null,function(err,hash){
		if(err) return next(err);
		user.password=hash;
		next();
	});
});

userSchema.plugin(titlize, {
  paths: [ 'name' ] // Array of paths 

});


// comparing the password 
userSchema.methods.comparePassword=function(password){
	return bcrypt.compareSync(password,this.password);
}
// exporting it to the server file
module.exports=mongoose.model('User',userSchema);



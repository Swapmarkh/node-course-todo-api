const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken'); 
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
		email : {
		type: String,
		required : true,
		trim : true,
		minlength :1,
		unique: true,
		validate :{
			validator : (value)=> {
				return validator.isEmail(value);
			},
			message: '{VALUE} is not a valid Email'
		}
	},
	password : {
		type: String,
		require :true,
		minlength: 6
	},
	tokens: [{
		 access : {
		 	type:String,
		 	required : true
		 },

		 token : {
		 	type:String,
		 	required : true
		 }
	}]	
});

userSchema.methods.toJSON = function (){
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function (){
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'welcome123').toString();//secret value

	user.tokens = user.tokens.concat([{access, token}]);

	return user.save().then(() => {
		return token;
	});
};

userSchema.methods.removeToken = function(token){
	var user = this;

	return user.update({
		$pull: {
			tokens:{token}
		}
	});
};

userSchema.statics.findByToken = function(token){	//similar to models but everything gets added as models
	var User = this;
	var decoded; //decoded JWT values

	try{
		decoded = jwt.verify(token, 'welcome123');
	}
	catch(e){
		return Promise.reject('wrong!');
	}

	return User.findOne({
		'_id' : decoded._id,
		'tokens.token' : token,
		'tokens.access' : 'auth'
	});
};

userSchema.statics.findByCredentials = function (email, password){
	var User = this;

	return User.findOne({email}).then((user) => {
		if(!user){
			return Promise.reject();
		}

		return new Promise((resolve, reject) =>{
			bcrypt.compare(password, user.password, (err, res) =>{
				if(res)
					resolve(user);
				
				else
					reject();
			});
		});
	});
};

userSchema.pre('save', function(next){
	var user = this;

	if(user.isModified('password')){
		bcrypt.genSalt(10, (err, salt)=> {
			bcrypt.hash(user.password, salt, (err, hash)=> {
				user.password=hash;				
				next(); 
			});
		});

	}else{
		next();
	}
});
var User = mongoose.model('User', userSchema);

module.exports = {User};
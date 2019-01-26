var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
	text: {
		type :String,
		required :true,
		minlength:1,
		trim :true
	},
	completed :{
		type:Boolean,
		default :false
	},
	completedAt:{
		type:Number,
		default :null
	},
	_creator:{
		required: true,
		type:mongoose.Schema.Types.ObjectId
	}
});

module.exports = {Todo};


// var newTodo = new Todo({
// 	text : 'Cook Alastair',
// 	completed:true,
// 	completedAt:78
// });

// newTodo.save().then((doc) =>{
// 	console.log('Saved Todo:', doc);
// }, (err) => {
// 	console.log('Unable to save Todo');
// });

// var newTodo2 = new Todo({
// 	text: 'Study DSA',
// 	completed: false,
// 	completedAt: 1
// });

// newTodo2.save().then((doc) => {
// 	console.log(`Success : ${doc}`);
// }, (err) =>{
// 	console.log(`Failed! : ${err}`);
// });
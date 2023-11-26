import mongoose from 'mongoose'

const user = mongoose.Schema({
	email: {
		type:String,
		unqiue:true
		},
	pswd: String,

	name: String,

	socialMediaLinks:[],

	previousWorks:[],
	
	contactNo: Number

})


const userModel = mongoose.model("User", user);
export default userModel;
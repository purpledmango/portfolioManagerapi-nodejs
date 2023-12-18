import mongoose from 'mongoose'

const user = mongoose.Schema({
	username: {
		type: String,
		unqiue: true,
		required: true,
	},
	passwordHash: { type: String, required: true },

	name: String,

})


const UserModel = mongoose.model("User", user);
export default UserModel;
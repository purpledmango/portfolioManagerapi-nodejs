import mongoose from 'mongoose'

const user = mongoose.Schema({
	username: {
		type: String,
		unqiue: true,
		required: true,
	},
	passwordHash: { type: String, required: true },
	email: { type: String },
	name: String,

}, { timestamps: true })


const UserModel = mongoose.model("User", user);
export default UserModel;
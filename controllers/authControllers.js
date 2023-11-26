import userModel from "../models/userModel.js";

export const loginController = async(req, res)=>{

	try{
		const {email, password} = req.data;
		const userExist = userModel.findOne(email);
		if (userExist && userExist.pswd === password){
			res.send("Login Successfull!")
		
		}
	}catch(err){
	console.log(err)
	}
}

export const signupController = async (req, res)=>{
	try{

		const {email, password} = req.data

		const newUser = new userModel({email,password});
		await newUser.save();

		res.send(newUser)


	}
	catch(err){
		console.log(err)
	}
}

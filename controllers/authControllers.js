import bcrypt from "bcryptjs"

import UserModel from "../models/userM.js";
import LeadModel from "../models/leadsM.js";

// POST - Login
export const loginController = async (req, res) => {
	try {
		const { username, password } = req.body;

		//Validate the client Input
		if (!username || !password) {
			return res.status(403).json({ message: "Please Enter all the Fields" });
		}

		//If the session already exists then return the User with "Already Logged in"
		if (req.session.user) {
			const userDetails = await UserModel.findOne({ username: req.session.user });
			//return status 
			return res.status(403).json({ message: "Already Logged In", ...userDetails._doc });
		}

		//Check the user from the DB
		const userExist = await UserModel.findOne({ username: username });

		//Return Messsage, User not Found
		if (!userExist) {
			return res.status(401).json({ message: "User not found" });
		}

		//Compaere the client password with the stored Hash and store the promises if authenticated
		const authenticated = await bcrypt.compare(password, userExist.passwordHash);

		if (!authenticated) {
			return res.status(401).json({ message: "Incorrect password entered" });
		}

		// Set session user
		req.session.user = { email: userExist.email, user: userExist.username, name: userExist.name };

		res.status(200).json({ message: "Login Successful", data: { email: userExist.email, username: userExist.username, name: userExist.name } });

	} catch (error) {
		console.error(error);
		res.status(502).json({ message: "Internal Server Error" });
	}
};

// GET - Logout
export const logoutController = async (req, res) => {
	try {
		if (req.session.user) {
			const logggedOut = await req.session.destroy()
			res.clearCookie('connect.sid');
			return res.status(200).json({ message: "Log Out Successfully" })
		}
		else {
			return res.status(401).json({ message: "Not Logged in" })
		}

	} catch (error) {
		return res.send("Internal Server Error", error)
	}
}


export const signupController = async (req, res) => {
	try {

		const { username, password, repeatPassword, name } = req.body

		//Validate the Client Details
		if (!username || !password || !repeatPassword || !name) {

			return res.status(401).json({ message: "Please enter the all the details" })
		}
		if (password !== repeatPassword) {

			return res.status(401).json({ message: "Passwords do not match" })
		}

		//Verify is username already Exists in DB
		const userExist = await UserModel.findOne({ username: username })

		if (userExist) {
			return res.status(401).json({ message: "Username already Taken" })
		}

		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt)
			;
		const registeredUser = new UserModel({ username: username, passwordHash: hashedPassword, name: name })
		registeredUser.save()

		if (!registeredUser) {
			return res.status(401).json({ message: "Uable to sign you up" })
		}

		res.status(200).json({ message: "Signup Successfull", ...registeredUser._doc })
	}
	catch (err) {
		console.log(err)
	}
}

export const updateUserController = async (req, res) => {
	console.log(req.session.user);

	try {
		const { name } = req.body;
		const { username } = req.params;

		console.log("THe grabbed User Prams from URL", req.params)
		// Find the user by username and update the user's data
		const user = await UserModel.findOneAndUpdate(
			{ username: username },
			{ $set: { name: name } },
			{ new: true } // Return the updated document
		);

		if (!user) {
			return res.status(401).json({ message: "Unable to update the User account" });
		}

		res.status(203).json({ message: "User Account Updated", ...user._doc });

	} catch (error) {
		console.error(error); // Use console.error for errors
		res.status(500).json({ message: "Internal Server Error" });
	}
};



//DELTE - Deletes a user
export const deleteUserController = async (req, res) => {
	try {

		const { username } = req.params;

		const existingUser = await UserModel.deleteOne({ username: username });

		if (!existingUser) {
			return res.status(404).json({ message: "User not found" });
		}
		// Return success message
		return res.status(200).json({ message: "User deleted successfully" });


	} catch (error) {
		console.error(error);
		res.status(500).send();
	}
}


// POST - Add user if a "Admin" User

export const addUserController = async (req, res) => {
	try {


		const { username, email, name, password, repeatPassword } = req.body;

		if (!username || !email || !name || !password, !repeatPassword) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		if (password !== repeatPassword) {
			return res.status(400).json({ message: "Passwords do not Match" });
		}

		// Check if the user already exists
		const existingUser = await UserModel.findOne({ username });

		if (existingUser) {
			return res.status(400).json({ message: "User with this username already exists" });
		}

		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt)

		const newUser = new UserModel({
			username,
			email,
			name,
			passwordHash: hashedPassword,
		});


		const savedUser = await newUser.save();
		return res.status(201).json({ message: "New User Addess Successfully", data: savedUser });

	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Internal Server Error!", error: error });
	}
};

// GET -- Get The Logged In user

export const fetchUserController = async (req, res) => {

	try {
		const { username } = req.params;

		const user = await UserModel.findOne({ username: username });

		if (user) {
			// Explicitly define the properties you want to expose
			const { _id, username, email, name } = user;

			return res.status(200).json({ message: "User Fetched", user: { _id, username, email, name } });
		} else {
			return res.status(404).json({ message: "User not found" });
		}

	} catch (error) {

		return res.status(500).json({ message: "Internal Server Error", error: error });
	}
};

export const getUsersControllers = async (req, res) => {
	try {
		const allUsers = await UserModel.find({})

		if (!allUsers) {
			res.status(404).json({ message: "Error while Fetching Users" })
		}

		res.status(200).json({ message: "Users Fetched", data: allUsers })
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error: error });
	}
}
import bcrypt from "bcryptjs"

import UserModel from "../models/userM.js";
import LeadModel from "../models/leadsM.js";

export const loginController = async (req, res) => {
	try {

		const { username, password } = req.body;
		if (req.session.user) {
			const userDetails = await UserModel.findOne({ username: req.session.user.username });
			return res.status(200).json({ message: "Already Logged In", ...userDetails._doc });
		}


		const userExist = await UserModel.findOne({ username: username });

		const authenticated = await bcrypt.compare(password, userExist.passwordHash);

		if (!authenticated) {
			return res.status(401).json({ message: "Incorrect password entered" });
		}

		// Set session user
		req.session.user = { authenticated: true, ...userExist._doc };

		res.status(200).json({ message: "Login Successful", ...userExist._doc });

	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const signupController = async (req, res) => {
	try {

		const { username, password, repeatPassword } = req.body
		if (!username || !password || !repeatPassword) {

			return res.status(401).json({ message: "Please enter the all the details" })
		}
		if (password !== repeatPassword) {

			return res.status(401).json({ message: "Passwords do not match" })
		}

		const userExist = await UserModel.findOne({ username: username })

		if (userExist) {
			return res.status(401).json({ message: "Username already Taken" })
		}

		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt)
			;
		const registeredUser = new UserModel({ username: username, passwordHash: hashedPassword })
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
	console.log(req.session.user)
	try {
		if (!req.session.user) {
			return res.status(403).json({ message: "Unauthorized Access" });
		}

		const { name } = req.body;

		// Find the user by username and update the user's data
		const user = await UserModel.findOneAndUpdate(
			{ username: req.session.user.username },
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


// GET - logout
export const logoutController = async (req, res) => {
	try {
		if (req.session.user.authenticated) {
			const logggedOut = await req.session.destroy()
			return res.status(200).json({ message: "Logged Out Successfully" })
		}
		else {
			return res.status(403).json({ message: "You need to be logged in to Log out" })
		}

	} catch (error) {
		return res.send("Internal Server Error", error)
	}
}

export const fetchUserController = async (req, res) => {

	try {

		if (req.session.user) {
			const uid = req.query.uid;

			const user = await UserModel.findOne({ _id: uid });

			if (user) {
				// Explicitly define the properties you want to expose
				const { _id, username, email, name } = user;

				return res.status(200).json({ message: "User Fetched", user: { _id, username, email, name } });
			} else {
				return res.status(404).json({ message: "User not found" });
			}
		} else {
			return res.status(401).json({ message: "Unauthorized. Unable to fetch the user." });
		}
	} catch (error) {
		console.error(error); // Log the error for debugging purposes
		console.log(error); // Log the error for debugging purposes
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const showLeadsController = async (req, res) => {
	try {
		if (req.session.user && req.session.user.authenticated) {
			const leads = await LeadModel.find({});
			return res.status(200).json(leads); // Corrected typo in 'status'
		} else {
			return res.status(401).json({ message: "Unauthorized" }); // Corrected typo in 'status'
		}
	} catch (error) {
		console.error(error); // Moved console.log after throw
		res.status(500).send(); // Set appropriate status code for internal server error
	}
};


export const fetchAllUsers = async (req, res) => {
	try {
		if (req.session.user.authenticated) {
			const users = await UserModel.find({});
			return res.status(200).json(users)
		} else {
			return res.status(401).json({ message: "Unauthorized" });
		}
	} catch (error) {
		console.error(err);
		res.status(500).send()
	}
}
export const deleteLeadsController = async (req, res) => {
	try {

		if (req.session.user && req.session.user.authenticated) {
			const { _id } = req.body;


			const deletedUser = await UserModel.findByIdAndDelete(_id);

			if (deletedUser) {
				return res.status(200).json({ message: "Lead deleted successfully" });
			} else {
				return res.status(404).json({ message: "Lead not found" });
			}
		} else {
			return res.status(401).json({ message: "Unauthorized" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).send();
	}
};

export const addLead = async (req, res) => {
	try {
		// Check if the user is authenticated
		if (req.session.user && req.session.user.authenticated) {
			// Assuming your request body contains the lead data
			const { name, email, contactNo } = req.body;

			// Validate if required fields are present
			if (!name || !email || !contactNo) {
				return res.status(400).json({ message: "Missing required fields" });
			}

			// Create a new lead
			const newLead = new LeadModel({
				name,
				email,
				contactNo,
			});

			// Save the lead to the database
			const savedLead = await newLead.save();

			// Return the saved lead details
			return res.status(201).json(savedLead);
		} else {
			return res.status(401).json({ message: "Unauthorized" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).send();
	}
};


export const updateLeadController = async (req, res) => {
	try {
		// Check if the user is authenticated
		if (req.session.user && req.session.user.authenticated) {
			// Assuming your request body contains the lead data and ID
			const { name, email, contactNo } = req.body;

			// Validate if required fields are present
			if (!name || !email || !contactNo) {
				return res.status(400).json({ message: "Missing required fields" });
			}

			// Find the lead by ID
			const existingLead = await LeadModel.findById(_id);

			// Check if the lead exists
			if (!existingLead) {
				return res.status(404).json({ message: "Lead not found" });
			}

			// Update lead information
			existingLead.name = name;
			existingLead.email = email;
			existingLead.contactNo = contactNo;

			// Save the updated lead to the database
			const updatedLead = await existingLead.save();

			// Return the updated lead details
			return res.status(200).json(updatedLead);
		} else {
			return res.status(401).json({ message: "Unauthorized" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).send();
	}
};


export const addUserController = async (req, res) => {
	try {
		// Check if the user is authenticated
		if (req.session.user && req.session.user.authenticated) {
			// Assuming your request body contains the user data
			const { username, email, name, password } = req.body;

			// Validate if required fields are present
			if (!username || !email || !name || !password) {
				return res.status(400).json({ message: "Missing required fields" });
			}

			// Check if the user already exists
			const existingUser = await UserModel.findOne({ email });

			if (existingUser) {
				return res.status(400).json({ message: "User with this email already exists" });
			}

			// Create a new user
			const newUser = new UserModel({
				username,
				email,
				name,
				password, // Make sure to hash the password before saving it in a real-world scenario
			});

			// Save the user to the database
			const savedUser = await newUser.save();

			// Return the saved user details
			return res.status(201).json(savedUser);
		} else {
			return res.status(401).json({ message: "Unauthorized" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).send();
	}
};

export const deleteUserController = async (req, res) => {
	try {
		// Check if the user is authenticated
		if (req.session.user && req.session.user.authenticated) {
			// Assuming your request body contains the user ID
			const { userId } = req.body;

			// Validate if the user ID is present
			if (!userId) {
				return res.status(400).json({ message: "Missing user ID" });
			}

			// Find the user by ID
			const existingUser = await UserModel.findById(userId);

			// Check if the user exists
			if (!existingUser) {
				return res.status(404).json({ message: "User not found" });
			}

			// Delete the user from the database
			await existingUser.remove();

			// Return success message
			return res.status(200).json({ message: "User deleted successfully" });
		} else {
			return res.status(401).json({ message: "Unauthorized" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).send();
	}
}
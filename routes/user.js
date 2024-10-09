
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken")
const {authenticateToken} = require("./userAuth")
const Carrier = require('../models/CarrierData');  // Import the Carrier model


// // Sign Up
// router.post("/sign-up", async (req, res) => {
//     try {
//         const { username, email, password, address } = req.body;

//         // Check username length is more than 4
//         if (username.length < 4) {
//             return res.status(400).json({ message: "Username is too short" });
//         }

//         // Check if username already exists
//         const existingUsername = await User.findOne({ username });
//         if (existingUsername) {
//             return res.status(400).json({ message: "Username already exists" });
//         }

//         // Check if email already exists
//         const existingEmail = await User.findOne({ email });
//         if (existingEmail) {
//             return res.status(400).json({ message: "Email already exists" });
//         }

//         // Check password length
//         if (password.length <= 5) {
//             return res.status(400).json({ message: "Password is too short" });
//         }

//         // Hash the password
//         const hashPass = await bcrypt.hash(password, 10);

//         // Create a new user
//         const newUser = new User({ username, email, password: hashPass, address });

//         await newUser.save();
//         return res.status(200).json({ message: "SignUp Successful" });
//     } catch (error) {
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// });


// Sign In
router.post("/sign-in", async (req, res) => {
    try {
        console.log("its working fine")
        const { username, password } = req.body;

        // Check if the user exists
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials, user does not exist" });
        }

        // Compare passwords using bcrypt
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (isMatch) {
            const authClaims = [
                {name: existingUser.username},
                {role: existingUser.role},
            ]
            const token = jwt.sign({authClaims} , "bookStore", {expiresIn: "30d"})
            return res.status(200).json({ 
                    message: "SignIn Successful" ,
                    id:existingUser._id ,
                    role: existingUser.role ,
                    token: token 
                });
        } else {
            return res.status(400).json({ message: "Invalid credentials, password does not match" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



// ger_user-information
router.get("/get-table-data" , authenticateToken ,  async (req , res)=>{
    try{
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);
        
    }catch(error){
        res.status(500).json({message: "Internal server error"})
    }
});


// ger_user-information
router.get("/get-user-information" , authenticateToken ,  async (req , res)=>{
    try{
        const {id} = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);
        
    }catch(error){
        res.status(500).json({message: "Internal server error"})
    }
});




// POST route to save the carrier data
router.post('/CarrierData', async (req, res) => {
    try {
        const carrierData = req.body;  // Data received from React
        // Create a new Carrier document
        console.log("This is data from the api = " , carrierData)
        console.log("This is data from the api = " , carrierData[0].Email)
        const newCarrier = new Carrier(carrierData[0]);
        
        // Save the new carrier data to MongoDB
        await newCarrier.save();
        
        res.status(200).json({ message: 'Carrier data saved successfully' });
    } catch (error) {
        console.error('Error saving carrier data:', error);
        res.status(500).json({ message: 'Error saving carrier data' });
    }
});



router.get('/carriersData', async (req, res) => {
    try {
      const carriers = await Carrier.find().sort({ _id: -1 });  // Fetch all records from the Carrier collection
      res.status(200).json(carriers);  // Send the result as JSON
    } catch (error) {
      res.status(500).json({ message: "Error fetching data", error });
    }
  });



module.exports = router;

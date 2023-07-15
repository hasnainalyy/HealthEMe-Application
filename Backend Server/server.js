const express = require('express');
const bodyParser = require('body-parser');
const { connect } = require('./database');
const { registerUser, loginUser } = require('./controllers/userController');
const { addMedication, updateMedication, getMedications, deleteMedication } = require('./controllers/medicationController');
const authenticate = require('./middlewares/authenticate');

const app = express();
const port = 8000;

app.use(bodyParser.json());

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.post('/api/register', registerUser);
app.post('/api/login', loginUser);
app.post('/api/medications', authenticate, addMedication);
app.put('/api/medications/:id', authenticate, updateMedication);
app.get('/api/medications', authenticate, getMedications);
app.delete('/api/medications/:id', authenticate, deleteMedication);




// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');


// // Initialize express app
// const app = express();
// const uri = "mongodb+srv://hasnainmak:Hasmus123*@cluster0.q9xpywd.mongodb.net/"
// async function connect(){
//     try {
//         await mongoose.connect(uri);
//         console.log("Connected!");
//     } catch (error) {
//         console.log(error);
//     }
// }
// connect();

// app.listen(8000, () => {
//     console.log("Server started on port 8000")
// })


// // Define user and medication schemas
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   password: { type: String, required: true },
// });

// const medicationSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   dosageUnits: { type: String, required: true },
//   dosage: { type: String, required: true },
//   notes: { type: String, required: true },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// });

// // Define models for user and medication
// const User = mongoose.model('User', userSchema);
// const Medication = mongoose.model('Medication', medicationSchema);

// // Middleware to parse request body
// app.use(bodyParser.json());

// // Endpoint to register new users
// app.post('/api/register', async (req, res) => {
//   try {
//     // Validate user data
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email address already registered' });
//     }

//     // Hash password and create new user
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();

//     // Return success message
//     return res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// });

// // Endpoint to log in users
// app.post('/api/login', async (req, res) => {
//   try {
//     // Validate user data
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email address or password' });
//     }

//     // Check if password is correct
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Invalid email address or password' });
//     }

//     // Create JWT and return it to the client
//     const token = jwt.sign({ userId: user._id }, 'secret');
//     return res.status(200).json({ token,user });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// });


// // Middleware to verify JWT
// const authenticate = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'Authentication failed: Missing token' });
//     }
  
//     jwt.verify(token, 'secret', (err, decodedToken) => {
//       if (err) {
//         return res.status(401).json({ message: 'Authentication failed: Invalid token' });
//       }
  
//       // Add the user ID to the request for use in other endpoints
//       req.userId = decodedToken.userId;
//       next();
//     });
//   };
  

// //for medication APIs

// // add medication
// app.post('/api/medications', authenticate, async (req, res) => {
//     const { name, dosageUnits, dosage, notes } = req.body;
    
//     // Validate input
//     if (!name || !dosageUnits || !dosage) {
//       return res.status(400).json({ message: 'Please provide a name, dosage units, and dosage' });
//     }
    
//     // Add the medication to the database
//     const newMedication = new Medication({
//       name,
//       dosageUnits,
//       dosage,
//       notes,
//       user: req.userId
//     });
  
//     try {
//       await newMedication.save();
//       res.json(newMedication);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });

// // update medication
//   app.put('/api/medications/:id', authenticate, async (req, res) => {
//     const { name, dosageUnits, dosage, notes } = req.body;
  
//     // Validate input
//     if (!name || !dosageUnits || !dosage) {
//       return res.status(400).json({ message: 'Please provide a name, dosage units, and dosage' });
//     }
  
//     // Find the medication in the database and update it
//     try {
//       const medication = await Medication.findOneAndUpdate(
//         { _id: req.params.id, user: req.userId },
//         { name, dosageUnits, dosage, notes },
//         { new: true }
//       );
  
//       // Check if the medication was found and updated successfully
//       if (!medication) {
//         return res.status(404).json({ message: 'Medication not found' });
//       }
  
//       res.json(medication);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
     


// app.get('/api/medications',authenticate, async (req, res) => {
//   const { name, sortBy } = req.query;

//   // filter object based on the name query parameter
//   let filterObject = {};
//   if (name) {
//     filterObject = { name: { $regex: name, $options: 'i' } };
//   }

//   // Sort object based on the sortBy query parameter
//    let sortObject = {};
//    if (sortBy) {
//      // Assuming the sortBy parameter is in the format "direction"
//      sortObject = { name: sortBy === 'desc' ? -1 : 1 };
//    }

//   // Fetch medications from the database with filtering and sorting applied
//   Medication.find(filterObject).populate('user', 'username')
//     .sort(sortObject)
//     .then((medications) => {
//       res.status(200).json(medications);
//     })
//     .catch((err) => {
//       // Handle error
//       res.status(500).json({ error: 'An error occurred' });
//     });
// });


// // delete medication
// app.delete('/api/medications/:id', authenticate, async (req, res) => {
//     const { id } = req.params;
    
//     try {
//     // Find the medication to delete
//     const deletedMedication = await Medication.findOneAndDelete({ _id: id, user: req.userId });
//     if (!deletedMedication) {
//     return res.status(404).json({ message: 'Medication not found' });
//     }
    
//     res.json(deletedMedication);
//     } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

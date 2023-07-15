const mongoose = require('mongoose');

const uri = 'mongodb+srv://hasnainmak:Hasmus123*@cluster0.q9xpywd.mongodb.net/';

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to the database!');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connect };

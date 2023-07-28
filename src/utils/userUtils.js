const dbConfig = require('../db/dbConfig');
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const UserModel = require('../models').models.User; // Renamed UserModel for clarity

// Database setup
const sequelize = new Sequelize(dbConfig.dbName, dbConfig.dbUser, dbConfig.dbPassword, {
  host: dbConfig.dbHost,
  dialect: dbConfig.dbDialect
});

// Models setup

// Function to create a user
async function createUser(email, password) {
  try {
    // Check if the email already exists
    const existingUser = await UserModel.findOne({
      where: {
        email: email
      }
    });

    if (existingUser) {
      console.log("User with this email already exists.");
      return;
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    await UserModel.create({
      email: email,
      password: hashedPassword
    });

    console.log("User created successfully.");
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    // Close the database connection after creating the user
    await sequelize.close();
  }
}

module.exports = createUser;

// run this file to remove the fake_so database
const mongoose = require("mongoose");
const { MONGO_URL } = require("./config");
async function dropDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Drop the database
    await mongoose.connection.db.dropDatabase();

    console.log("Database dropped successfully");
  } catch (error) {
    console.error("Error dropping database:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
  }
}

// Call the function
dropDatabase();

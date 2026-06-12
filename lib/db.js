const mongoose = require("mongoose");

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/inferno_tech";

  cachedConnection = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
  });

  return cachedConnection;
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
  connectDB,
  isValidObjectId
};

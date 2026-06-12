const mongoose = require("mongoose");

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI || "";

  if (!uri) {
    const error = new Error("MONGODB_URI is missing. Add it in Vercel Project Settings > Environment Variables, then redeploy.");
    error.statusCode = 500;
    throw error;
  }

  if (process.env.VERCEL && uri.includes("127.0.0.1")) {
    const error = new Error("MONGODB_URI is still using localhost. Use your MongoDB Atlas connection string on Vercel.");
    error.statusCode = 500;
    throw error;
  }

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

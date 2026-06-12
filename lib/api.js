function sendMethodNotAllowed(res, methods) {
  res.setHeader("Allow", methods);
  return res.status(405).json({ message: "Method not allowed." });
}

function handleApiError(res, error) {
  console.error(error);

  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error.name === "MongoServerSelectionError") {
    return res.status(500).json({
      message: "Could not connect to MongoDB. Check Atlas Network Access and your MONGODB_URI in Vercel."
    });
  }

  if (error.name === "MongoParseError") {
    return res.status(500).json({
      message: "MongoDB connection string is invalid. Check that the database password is URL-encoded."
    });
  }

  if (error.name === "MongooseServerSelectionError") {
    return res.status(500).json({
      message: "Could not connect to MongoDB. Check Atlas Network Access and your MONGODB_URI in Vercel."
    });
  }

  return res.status(error.statusCode || 500).json({
    message: "Server error. Please try again."
  });
}

module.exports = {
  handleApiError,
  sendMethodNotAllowed
};

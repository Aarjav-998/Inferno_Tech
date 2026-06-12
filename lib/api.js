function sendMethodNotAllowed(res, methods) {
  res.setHeader("Allow", methods);
  return res.status(405).json({ message: "Method not allowed." });
}

function handleApiError(res, error) {
  console.error(error);
  return res.status(error.statusCode || 500).json({
    message: error.statusCode ? error.message : "Server error. Please try again."
  });
}

module.exports = {
  handleApiError,
  sendMethodNotAllowed
};

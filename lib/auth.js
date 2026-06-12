const jwt = require("jsonwebtoken");

function getJwtSecret() {
  return process.env.JWT_SECRET || "development-only-secret";
}

function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, getJwtSecret(), { expiresIn: "7d" });
}

function getAuth(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    const error = new Error("Authentication required.");
    error.statusCode = 401;
    throw error;
  }

  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    const authError = new Error("Invalid or expired session.");
    authError.statusCode = 401;
    throw authError;
  }
}

module.exports = {
  createToken,
  getAuth
};

const { sendMethodNotAllowed } = require("../lib/api");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return sendMethodNotAllowed(res, ["GET"]);
  }

  return res.status(200).json({ status: "ok" });
};

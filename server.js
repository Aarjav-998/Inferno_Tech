const path = require("path");
const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/inferno_tech";

const registerHandler = require("./api/auth/register");
const loginHandler = require("./api/auth/login");
const meHandler = require("./api/auth/me");
const healthHandler = require("./api/health");
const messageHandler = require("./api/message");
const messageByIdHandler = require("./api/message/[id]");
const notesByIdHandler = require("./api/notes/[id]");
const usersByIdHandler = require("./api/users/[id]");
const waitlistHandler = require("./api/waitlist");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/health", healthHandler);
app.post("/api/auth/register", registerHandler);
app.post("/api/auth/login", loginHandler);
app.get("/api/auth/me", meHandler);
app.post(["/api/waitlist", "/waitlist"], waitlistHandler);
app.post(["/api/message", "/message"], messageHandler);
app.get(["/api/message/:id", "/message/:id"], (req, res) => {
  req.query.id = req.params.id;
  return messageByIdHandler(req, res);
});
app.delete(["/api/message/:id", "/message/:id"], (req, res) => {
  req.query.id = req.params.id;
  return messageByIdHandler(req, res);
});
app.patch(["/api/notes/:id", "/notes/:id"], (req, res) => {
  req.query.id = req.params.id;
  return notesByIdHandler(req, res);
});
app.all("/api/users/:id", (req, res) => {
  req.query.id = req.params.id;
  return usersByIdHandler(req, res);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Inferno Tech running at http://localhost:${PORT}`);
});

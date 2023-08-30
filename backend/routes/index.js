// backend/routes/index.js
const express = require("express");
const router = express.Router();

const apiRouter = require("./api");

router.use("/api", apiRouter);

// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  return res.status(200).json({
    "XSRF-Token": csrfToken,
  });
});

router.get("/", (req, res) => {
  return res.json("Hello there");
});

module.exports = router;

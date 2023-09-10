const router = require("express").Router();
const sessionRouter = require("./session");
const usersRouter = require("./users");
const spotsRouter = require("./spots");
const reviewsRouter = require("./reviews");

const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/spots", spotsRouter);
router.use("/reviews", reviewsRouter);

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;

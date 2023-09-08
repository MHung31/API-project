const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Spot } = require("../../db/models");

const validateCreateSpot = [
  //   check("credential")
  //     .exists({ checkFalsy: true })
  //     .notEmpty()
  //     .withMessage("Please provide a valid email or username."),
  //   check("password")
  //     .exists({ checkFalsy: true })
  //     .withMessage("Please provide a password."),
  //   handleValidationErrors,
];

router.post("/", requireAuth, validateCreateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const { user } = req;
  const newSpot = await Spot.create({
    ownerId: user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  //   const safeUser = {
  //     id: user.id,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     email: user.email,
  //     username: user.username,
  //   };

  return res.json(newSpot);
});

// router.delete("/", (req, res) => {
//   res.clearCookie("token");
//   return res.json({ message: "success" });
// });

// router.get("/", requireAuth, (req, res) => {
//   const { user } = req;
//   if (user) {
//     const safeUser = {
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       username: user.username,
//     };
//     return res.json({
//       user: safeUser,
//     });
//   } else return res.json({ user: null });
// });

module.exports = router;

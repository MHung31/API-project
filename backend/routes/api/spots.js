const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Spot, Review } = require("../../db/models");

const validateCreateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({
      max: 50,
    })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

const validateCreateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({
      min: 1,
      max: 5,
    })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

//create a review for a spot
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateCreateReview,
  async (req, res, next) => {
    let { review, stars } = req.body;
    const spotId = Number(req.params.spotId);
    const { user } = req;
    stars = Number(stars);

    if (!(await Spot.findByPk(spotId))) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      next(err);
    }
    if (await Review.findOne({ where: { userId: user.id, spotId } })) {
      const err = new Error("User already has a review for this spot");
      err.status = 500;
      next(err);
    }

    const newReview = await Review.create({
      userId: user.id,
      spotId,
      review,
      stars,
    });

    return res.status(201).json(newReview);
  }
);

//Create a spot
router.post("/", requireAuth, validateCreateSpot, async (req, res, next) => {
  let { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const { user } = req;

  lat = Number(lat);
  lng = Number(lng);
  price = Number(price);

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

  return res.status(201).json(newSpot);
});

// router.delete("/", (req, res) => {
//   res.clearCookie("token");
//   return res.json({ message: "success" });
// });

// router.get("/current", requireAuth, async (req, res) => {
//   const { user } = req;
//   if (user) {
//     const currentSpots = await Spot.findAll({
//       where: {
//         ownerId: user.id,
//       },
//     });

//     return res.json(currentSpots);
//   }
// });

//Pending reviews and images table creation
router.get("/", async (req, res) => {
  //add avgRating, calculated from reviews table
  //add previewImage, pulled from images table
  const currentSpots = await Spot.findAll();

  return res.json({ Spots: currentSpots });
});

module.exports = router;

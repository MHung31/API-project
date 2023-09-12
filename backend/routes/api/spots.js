const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const {
  Spot,
  Review,
  Booking,
  User,
  Image,
  sequelize,
} = require("../../db/models");

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

const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .isISO8601()
    .withMessage("Enter a valid start date YYYY-MM-DD"),
  check("endDate")
    .exists({ checkFalsy: true })
    .isISO8601()
    .withMessage("Enter a valid end date YYYY-MM-DD"),
  handleValidationErrors,
];

//Add image to post
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  let { url, preview } = req.body;
  const spotId = Number(req.params.spotId);
  const { user } = req;

  const currSpot = await Spot.findByPk(spotId);

  if (!currSpot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }
  if (currSpot.ownerId !== user.id) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }

  //TODO: Image Preview changes depending on situations
  //Requires currSpot to include images when pulling
  //If no images exist, first image preview has to be true
  //if preview is true, then old true image turns false
  //if preview is false, and previous image has true, preview can stay false

  // const currSpotImage = await Spot.findByPk(spotId, {
  //   include: {
  //     model: Image,
  //     where: {
  //       preview: true,
  //     },
  //   },
  // });

  // // console.log(currSpotImage)

  // if (!currSpotImage) {
  //   preview = true;
  // } else if (preview === true) {
  //   currSpotImage.Images[0].preview = false;
  //   currSpotImage.save();
  // }
  // const currSpotImages = await Spot.findByPk(spotId, {
  //   include: {
  //     model: Image,
  //   },
  // });
  // console.log(currSpotImages.Images);

  const spotImage = await Image.create({
    url,
    preview,
    imageableId: spotId,
    imageableType: "Spot",
  });
  return res.json({
    id: spotImage.id,
    url: spotImage.url,
    preview: spotImage.preview,
  });
});

//Create a Booking
router.post(
  "/:spotId/bookings",
  requireAuth,
  validateBooking,
  async (req, res, next) => {
    let { startDate, endDate } = req.body;
    const { user } = req;
    const spotId = Number(req.params.spotId);

    if (!(await Spot.findByPk(spotId))) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    const bookedDates = await Booking.findAll({
      where: {
        spotId,

        [Op.or]: [
          {
            startDate: {
              [Op.gte]: startDate,
            },
          },
          {
            endDate: { [Op.lte]: endDate },
          },
        ],
      },
    });
    //start         startDate        endDate        end
    bookedDates.forEach((booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      console.log(start, startDate, endDate, end);
      if (new Date(startDate) - start >= 0 && end - new Date(startDate) >= 0) {
        const err = new Error(
          "Sorry, this spot is already booked for the specified dates"
        );
        err.status = 403;
        err.errors = {
          startDate: "Start date conflicts with an existing booking",
        };
        return next(err);
      }

      if (new Date(endDate) - start >= 0 && end - new Date(endDate) >= 0) {
        const err = new Error(
          "Sorry, this spot is already booked for the specified dates"
        );
        err.status = 403;
        err.errors = {
          endDate: "End date conflicts with an existing booking",
        };
        return next(err);
      }
    });

    const newBooking = await Booking.create({
      userId: user.id,
      spotId,
      startDate,
      endDate,
    });

    return res.status(201).json(newBooking);
  }
);

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
      return next(err);
    }
    if (await Review.findOne({ where: { userId: user.id, spotId } })) {
      const err = new Error("User already has a review for this spot");
      err.status = 500;
      return next(err);
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

//edit a spot
router.put(
  "/:spotId",
  requireAuth,
  validateCreateSpot,
  async (req, res, next) => {
    const spotId = Number(req.params.spotId);
    const { user } = req;

    req.body.lat = Number(req.body.lat);
    req.body.lng = Number(req.body.lng);
    req.body.price = Number(req.body.price);

    const currSpot = await Spot.findByPk(spotId);

    if (!currSpot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }
    if (currSpot.ownerId !== user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    for (let key in req.body) {
      currSpot[key] = req.body[key];
    }
    await currSpot.save();

    return res.json(currSpot);
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

//delete a spot
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const spotId = Number(req.params.spotId);

  const currSpot = await Spot.findByPk(spotId);

  if (!currSpot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (currSpot.ownerId !== user.id) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }
  console.log("hello----------", currSpot)
  await currSpot.destroy();

  return res.json({ message: "Successfully deleted" });
});

//Get all spots of current
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const currentSpots = await Spot.findAll({
    where: {
      ownerId: user.id,
    },
    include: [{ model: Review }, { model: Image }],
  });

  if (!currentSpots) {
    return res.json({
      message: "No spots have been entered into the database at this time.",
    });
  }

  let updatedSpots = currentSpots.map((spot) => {
    const {
      id,
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      createdAt,
      updatedAt,
    } = spot;
    let avgRating;
    let imagePreview;
    if (!spot.Reviews.length) {
      avgRating = "There are currently no reviews for this spot";
    } else {
      let sum = 0;
      spot.Reviews.forEach((review) => {
        sum += review.stars;
      });
      avgRating = Math.round((sum / spot.Reviews.length) * 10) / 10;
    }

    if (!spot.Images.length) {
      imagePreview = "There are currently no images for this spot";
    } else {
      spot.Images.forEach((image) =>
        image.preview === true ? (imagePreview = image.url) : null
      );
    }
    return {
      id,
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      createdAt,
      updatedAt,
      avgRating,
      imagePreview,
    };
  });

  return res.json({ Spots: updatedSpots });
});

//get spots from id
router.get("/:spotId", async (req, res, next) => {
  const spotId = Number(req.params.spotId);

  const currentSpot = await Spot.findByPk(spotId, {
    include: [
      {
        model: Review,
      },
      {
        model: Image,
        attributes: ["id", "url", "preview"],
      },

      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  if (!currentSpot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  const {
    id,
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
    createdAt,
    updatedAt,
  } = currentSpot;
  let avgStarRating;
  if (!currentSpot.Reviews.length) {
    avgStarRating = "There are currently no reviews for this spot";
  } else {
    let sum = 0;
    currentSpot.Reviews.forEach((review) => {
      sum += review.stars;
    });
    avgRating = Math.round((sum / currentSpot.Reviews.length) * 10) / 10;
  }
  const updatedSpot = {
    id,
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
    createdAt,
    updatedAt,
    numReviews: currentSpot.Reviews.length,
    avgStarRating,
    SpotImages: currentSpot.Images.length
      ? currentSpot.Images
      : "There are currently no images for this spot",
    Owner: currentSpot.User,
  };

  return res.json(updatedSpot);
});

//Get all spots
router.get("/", async (req, res) => {
  const currentSpots = await Spot.findAll({
    include: [{ model: Review }, { model: Image }],
  });

  if (!currentSpots.length) {
    return res.json({
      message: "No spots have been entered into the database at this time.",
    });
  }

  let updatedSpots = currentSpots.map((spot) => {
    const {
      id,
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      createdAt,
      updatedAt,
    } = spot;
    let avgRating;
    let imagePreview;
    if (!spot.Reviews.length) {
      avgRating = "There are currently no reviews for this spot";
    } else {
      let sum = 0;
      spot.Reviews.forEach((review) => {
        sum += review.stars;
      });
      avgRating = Math.round((sum / spot.Reviews.length) * 10) / 10;
    }

    if (!spot.Images.length) {
      imagePreview = "There are currently no images for this spot";
    } else {
      spot.Images.forEach((image) =>
        image.preview === true ? (imagePreview = image.url) : null
      );
    }
    return {
      id,
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      createdAt,
      updatedAt,
      avgRating,
      imagePreview,
    };
  });

  return res.json({ Spots: updatedSpots });
});

module.exports = router;

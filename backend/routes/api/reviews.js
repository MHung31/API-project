const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Spot, Review, Booking, User, Image } = require("../../db/models");

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

//Add image to review
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const { url } = req.body;
  const reviewId = Number(req.params.reviewId);
  const { user } = req;

  const currReview = await Review.findByPk(reviewId, {
    include: {
      model: Image,
    },
  });

  if (!currReview) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    return next(err);
  }
  if (currReview.userId !== user.id) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }

  if (currReview.Images.length >= 10) {
    const err = new Error(
      "Maximum number of images for this resource was reached"
    );
    err.status = 403;
    return next(err);
  }

  const reviewImage = await Image.create({
    url,
    preview: false,
    imageableId: reviewId,
    imageableType: "Review",
  });
  return res.json({
    id: reviewImage.id,
    url: reviewImage.url,
  });
});

//get current user reviews
router.get("/current", requireAuth, async (req, res, next) => {
  const { user } = req;

  const userReviews = await Review.findAll({
    where: {
      userId: user.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: {
          exclude: ["createdAt", "updatedAt", "description"],
        },
        include: {
          model: Image,
          where: {
            imageableType: "Spot",
            preview: true,
          },
          attributes: ["preview", "url"],
        },
      },
      {
        model: Image,
        where: {
          imageableType: "Review",
        },
        attributes: ["id", "url"],
      },
    ],
  });

  if (!userReviews.length) {
    return res.json({ message: "You have not entered any reviews yet." });
  }

  const updatedReviews = userReviews.map((userReview) => {
    const {
      id,
      userId,
      spotId,
      review,
      stars,
      createdAt,
      updatedAt,
      User,
      Spot,
      Images,
    } = userReview;
    let previewImage;
    console.log(Spot.Images);
    if (!Spot.Images) {
      previewImage = "There are currently no images for this spot";
    } else {
      previewImage = Spot.Images[0].url;
    }

    let newSpot = {
      id: Spot.id,
      ownerId: Spot.ownerId,
      address: Spot.address,
      city: Spot.city,
      state: Spot.state,
      country: Spot.country,
      lat: Spot.lat,
      lng: Spot.lng,
      name: Spot.name,
      price: Spot.price,
      previewImage: previewImage,
    };

    return {
      id,
      userId,
      spotId,
      review,
      stars,
      createdAt,
      updatedAt,
      User,
      Spot: newSpot,
      ReviewImages: Images,
    };
  });

  return res.json(updatedReviews);
});

//delete a review
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const reviewId = Number(req.params.reviewId);

  const currReview = await Review.findByPk(reviewId);
  
  if (!currReview) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (currReview.userId !== user.id) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }

  await currReview.destroy();

  return res.json({ message: "Successfully deleted" });
});

//edit a review
router.put(
  "/:reviewId",
  requireAuth,
  validateCreateReview,
  async (req, res, next) => {
    const { user } = req;
    const reviewId = Number(req.params.reviewId);
    const { review, stars } = req.body;

    const currReview = await Review.findByPk(reviewId);

    if (!currReview) {
      const err = new Error("Review couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (currReview.userId !== user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    await currReview.update({
      review,
      stars,
    });

    return res.json(currReview);
  }
);

module.exports = router;

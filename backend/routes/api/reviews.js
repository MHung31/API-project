const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Spot, Review, Booking, User, Image } = require("../../db/models");

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

module.exports = router;

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

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const imageId = Number(req.params.imageId);

  const image = await Image.findByPk(imageId, {
    include: {
      model: Review,
      attributes: ["userId"],
    },
  });

  if (!image) {
    const err = new Error("Review Image couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (user.id !== image.Review.userId) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }

  await image.destroy();

  return res.json({ message: "Successfully deleted" });
});

module.exports = router;

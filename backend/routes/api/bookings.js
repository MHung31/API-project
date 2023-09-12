const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Spot, Review, Booking, User, Image } = require("../../db/models");

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

//Get booking of current user
router.get("/current", requireAuth, async (req, res, next) => {
  const { user } = req;

  const userBookings = await Booking.findAll({
    where: {
      userId: user.id,
    },
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ["createdAt", "updatedAt", "description"],
        },
        include: {
          model: Image,
          attributes: ["preview", "url"],
        },
      },
    ],
  });

  if (!userBookings) {
    const err = new Error("No bookings have been found");
    err.status = 404;
    return next(err);
  }

  const newBookings = userBookings.map((booking) => {
    const {
      id,
      spotId,
      userId,
      startDate,
      endDate,
      createdAt,
      updatedAt,
      Spot,
    } = booking;

    let previewImage = "There are currently no images for this spot";

    if (Spot.Images) {
      Spot.Images.forEach((image) =>
        image.preview ? (previewImage = image.url) : null
      );
    }

    const newSpot = {
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
      previewImage,
    };

    return {
      id,
      spotId,
      Spot: newSpot,
      userId,
      startDate,
      endDate,
      createdAt,
      updatedAt,

    };
  });

  return res.json({ Bookings: newBookings });
});

//Edit booking by id
router.put("/:bookingId", validateBooking, async (req, res, next) => {
  const { user } = req;
  const bookingId = Number(req.params.bookingId);
  let { startDate, endDate } = req.body;

  const currBooking = await Booking.findByPk(bookingId);

  if (!currBooking) {
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (currBooking.userId !== user.id) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }
  if (new Date(currBooking.endDate) < new Date()) {
    const err = new Error("Past bookings can't be modified");
    err.status = 403;
    return next(err);
  }

  const bookedDates = await Booking.findAll({
    where: {
      spotId: currBooking.spotId,
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
      [Op.not]: {
        id: bookingId,
      },
    },
  });
  bookedDates.forEach((booking) => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
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

  await currBooking.update({
    startDate,
    endDate,
  });

  return res.json(currBooking);
});

module.exports = router;

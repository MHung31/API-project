"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId",
      });

      Booking.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      startDate: {
        allowNull: false,
        type: DataTypes.DATEONLY,
        validate: {
          isDate: true,
        },
      },
      endDate: {
        allowNull: false,
        type: DataTypes.DATEONLY,
        validate: {
          isDate: true,
          afterStart(value) {
            if (value <= this.startDate) {
              throw new Error("endDate cannot be on or before startDate");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};

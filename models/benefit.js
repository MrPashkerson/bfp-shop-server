'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Benefit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Benefit.init(
    {
      benefit_name: DataTypes.STRING,
      benefit_type: DataTypes.STRING,
      benefit_category: DataTypes.STRING,
      benefit_description: DataTypes.STRING,
      price: DataTypes.INTEGER,
      vendor_code: DataTypes.STRING,
      benefit_image: DataTypes.STRING,
      in_stock: DataTypes.BOOLEAN,
      bestseller: DataTypes.BOOLEAN,
      new: DataTypes.BOOLEAN,
      popularity: DataTypes.INTEGER,
      info: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Benefit',
    },
  );
  return Benefit;
};

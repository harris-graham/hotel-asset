import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Material = db.define('material', {
  MatID: { type: DataTypes.INTEGER(12), primaryKey: true, autoIncrement: true },
  MatName: { type: DataTypes.STRING(100), allowNull: false },
  MatPrice: { type: DataTypes.FLOAT(12, 2), defaultValue: 0.00 },
  MatDate: { type: DataTypes.STRING, allowNull: true },
  MatImg: { type: DataTypes.TEXT('long'), allowNull: true },
  Category: { type: DataTypes.STRING(50), defaultValue: 'General' },
  UsefulLifeYears: { type: DataTypes.INTEGER, defaultValue: 5 },
  SalvageValue: { type: DataTypes.FLOAT(12, 2), defaultValue: 0.00 }
}, { freezeTableName: true, timestamps: false });

(async () => {
  await db.sync();
})();

export default Material;

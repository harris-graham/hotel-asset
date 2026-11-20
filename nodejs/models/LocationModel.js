import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Location = db.define('location', {
  LocID: { type: DataTypes.INTEGER(12), primaryKey: true, autoIncrement: true },
  LocName: { type: DataTypes.STRING(50), allowNull: false },
  LocColor: { type: DataTypes.STRING(7), defaultValue: '#4e73df' },
  EntID: { type: DataTypes.INTEGER(6), allowNull: true }
}, { freezeTableName: true, timestamps: false });

(async () => {
  await db.sync();
})();

export default Location;

import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Entity = db.define('entity', {
  EntID: { type: DataTypes.INTEGER(6), primaryKey: true, autoIncrement: true },
  EntName: { type: DataTypes.STRING(50), allowNull: false },
  EntDesc: { type: DataTypes.STRING(255), allowNull: true }
}, { freezeTableName: true, timestamps: false });

(async () => {
  await db.sync();
})();

export default Entity;

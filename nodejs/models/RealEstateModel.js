import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const RealEstate = db.define('realestate', {
  MatID: { type: DataTypes.INTEGER(12), primaryKey: true },
  LocID: { type: DataTypes.INTEGER(12) },
  ResQty: { type: DataTypes.INTEGER(6) }
}, { freezeTableName: true, timestamps: false });

(async () => {
  await db.sync();
})();

export default RealEstate;
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const OutStock = db.define('outstock', {
  OutID: { type: DataTypes.INTEGER(12), primaryKey: true, autoIncrement: true },
  OutQty: { type: DataTypes.INTEGER(6), allowNull: false },
  OutMotiv: { type: DataTypes.STRING(100), allowNull: false },
  OutDate: { type: DataTypes.STRING, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  MatID: { type: DataTypes.INTEGER(12), allowNull: false },
  LocID: { type: DataTypes.INTEGER(12), allowNull: false },
  UserID: { type: DataTypes.INTEGER(12), allowNull: true }
}, { freezeTableName: true, timestamps: false });

(async () => {
  await db.sync();
})();

export default OutStock;

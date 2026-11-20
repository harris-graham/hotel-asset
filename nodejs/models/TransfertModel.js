import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Transfert = db.define('transfert', {
  TransID: { type: DataTypes.INTEGER(12), primaryKey: true, autoIncrement: true },
  TransDate: { type: DataTypes.STRING, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  TransQty: { type: DataTypes.INTEGER(6), allowNull: false },
  MatID: { type: DataTypes.INTEGER(12), allowNull: false },
  LocSend: { type: DataTypes.INTEGER(12), allowNull: false },
  LocRecip: { type: DataTypes.INTEGER(12), allowNull: false },
  UserID: { type: DataTypes.INTEGER(12), allowNull: true }
}, { freezeTableName: true, timestamps: false });

(async () => {
  await db.sync();
})();

export default Transfert;

import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User = db.define('user', {
  UserID: { type: DataTypes.INTEGER(12), primaryKey: true },
  UserName: { type: DataTypes.CHAR(20) },
  UserPword: { type: DataTypes.CHAR(60) },
  UserType: { type: DataTypes.CHAR(6) },
  refresh_token: { type: DataTypes.TEXT }
}, { freezeTableName: true });

(async () => {
  await db.sync();
})();

export default User;
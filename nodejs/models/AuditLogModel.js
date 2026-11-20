import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const AuditLog = db.define('audit_log', {
  LogID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Action: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  EntityType: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  IpAddress: {
    type: DataTypes.STRING(45),
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: false
});

(async () => {
  await db.sync();
})();

export default AuditLog;

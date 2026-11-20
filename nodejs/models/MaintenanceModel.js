import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Maintenance = db.define('maintenance', {
  MaintID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  MatID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  LocID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  MaintType: {
    type: DataTypes.ENUM('Preventive', 'Corrective', 'Inspection'),
    defaultValue: 'Corrective'
  },
  MaintDesc: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  MaintCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  MaintStatus: {
    type: DataTypes.ENUM('Scheduled', 'In Progress', 'Completed'),
    defaultValue: 'Scheduled'
  },
  ScheduledDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  CompletedDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Technician: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: true
});

(async () => {
  await db.sync();
})();

export default Maintenance;

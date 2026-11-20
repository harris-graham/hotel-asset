import Maintenance from "../models/MaintenanceModel.js";
import Material from "../models/MaterialModel.js";
import Location from "../models/LocationModel.js";
import User from "../models/UserModel.js";
import AuditLog from "../models/AuditLogModel.js";

// Relations
Material.hasMany(Maintenance, { foreignKey: 'MatID' });
Maintenance.belongsTo(Material, { foreignKey: 'MatID' });

Location.hasMany(Maintenance, { foreignKey: 'LocID' });
Maintenance.belongsTo(Location, { foreignKey: 'LocID' });

User.hasMany(Maintenance, { foreignKey: 'UserID' });
Maintenance.belongsTo(User, { foreignKey: 'UserID' });

export const maintSelect = async (req, res) => {
  try {
    const list = await Maintenance.findAll({
      include: [Material, Location, User],
      order: [['ScheduledDate', 'DESC']]
    });
    return res.status(200).json(list);
  } catch (error) {
    console.error("Error in maintSelect:", error);
    return res.status(500).json({ error: "Failed to fetch maintenance tasks" });
  }
};

export const maintInsert = async (req, res) => {
  const { matid, locid, mainttype, maintdesc, maintcost, scheduleddate, technician, uidact } = req.body;
  try {
    const task = await Maintenance.create({
      MatID: matid,
      LocID: locid,
      MaintType: mainttype || 'Corrective',
      MaintDesc: maintdesc,
      MaintCost: maintcost || 0.00,
      MaintStatus: 'Scheduled',
      ScheduledDate: scheduleddate || new Date().toISOString().slice(0, 10),
      Technician: technician,
      UserID: uidact || null
    });

    await AuditLog.create({
      UserID: uidact || null,
      Action: 'MAINTENANCE_SCHEDULED',
      EntityType: 'Maintenance',
      Details: `Scheduled ${mainttype} maintenance for asset #${matid} in room #${locid}`,
      IpAddress: req.ip
    });

    return res.status(201).json({ msg: "Maintenance scheduled successfully", task });
  } catch (error) {
    console.error("Error in maintInsert:", error);
    return res.status(500).json({ error: "Failed to schedule maintenance" });
  }
};

export const maintUpdate = async (req, res) => {
  const { maintid } = req.params;
  const { mainttype, maintdesc, maintcost, maintstatus, scheduleddate, completeddate, technician } = req.body;
  try {
    const updateData = {};
    if (mainttype !== undefined) updateData.MaintType = mainttype;
    if (maintdesc !== undefined) updateData.MaintDesc = maintdesc;
    if (maintcost !== undefined) updateData.MaintCost = maintcost;
    if (maintstatus !== undefined) {
      updateData.MaintStatus = maintstatus;
      if (maintstatus === 'Completed' && !completeddate) {
        updateData.CompletedDate = new Date().toISOString().slice(0, 10);
      }
    }
    if (scheduleddate !== undefined) updateData.ScheduledDate = scheduleddate;
    if (completeddate !== undefined) updateData.CompletedDate = completeddate;
    if (technician !== undefined) updateData.Technician = technician;

    await Maintenance.update(updateData, { where: { MaintID: maintid } });
    return res.status(200).json({ msg: "Maintenance updated successfully" });
  } catch (error) {
    console.error("Error in maintUpdate:", error);
    return res.status(500).json({ error: "Failed to update maintenance" });
  }
};

export const maintDelete = async (req, res) => {
  const { maintid } = req.params;
  try {
    await Maintenance.destroy({ where: { MaintID: maintid } });
    return res.status(200).json({ msg: "Maintenance deleted successfully" });
  } catch (error) {
    console.error("Error in maintDelete:", error);
    return res.status(500).json({ error: "Failed to delete maintenance" });
  }
};

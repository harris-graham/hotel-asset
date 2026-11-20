import Entity from "../models/EntityModel.js";
import Location from "../models/LocationModel.js";
import Material from "../models/MaterialModel.js";
import OutStock from "../models/OutStockModel.js";
import RealEstate from "../models/RealEstateModel.js";
import Transfert from "../models/TransfertModel.js";
import User from "../models/UserModel.js";
import Maintenance from "../models/MaintenanceModel.js";
import AuditLog from "../models/AuditLogModel.js";
import bcrypt from "bcryptjs";
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// =============================================================================
// Entity Controllers
// =============================================================================
export const entSelect = async (req, res) => {
  try {
    const ent = await Entity.findAll({ order: [['EntName', 'ASC']] });
    return res.status(200).json(ent);
  } catch (error) {
    console.error("Error in entSelect:", error);
    return res.status(500).json({ error: "Failed to fetch entities" });
  }
};

export const entInsert = async (req, res) => {
  const { entname, entdesc } = req.body;
  if (!entname) return res.status(400).json({ error: "Entity name is required" });
  try {
    const newEnt = await Entity.create({ EntName: entname, EntDesc: entdesc || null });
    return res.status(201).json({ msg: "Entity created successfully", entity: newEnt });
  } catch (error) {
    console.error("Error in entInsert:", error);
    return res.status(500).json({ error: "Failed to create entity" });
  }
};

export const entUpdate = async (req, res) => {
  const { entid } = req.params;
  const { entname, entdesc } = req.body;
  try {
    await Entity.update({ EntName: entname, EntDesc: entdesc }, { where: { EntID: entid } });
    return res.status(200).json({ msg: "Entity updated successfully" });
  } catch (error) {
    console.error("Error in entUpdate:", error);
    return res.status(500).json({ error: "Failed to update entity" });
  }
};

export const entDelete = async (req, res) => {
  const { entid } = req.params;
  try {
    await Entity.destroy({ where: { EntID: entid } });
    return res.status(200).json({ msg: "Entity deleted successfully" });
  } catch (error) {
    console.error("Error in entDelete:", error);
    return res.status(500).json({ error: "Failed to delete entity" });
  }
};

// =============================================================================
// Location Controllers (Rooms / Suites)
// =============================================================================
Entity.hasMany(Location, { foreignKey: 'EntID' });
Location.belongsTo(Entity, { foreignKey: 'EntID' });

export const locSelect = async (req, res) => {
  try {
    const loc = await Location.findAll({
      include: [Entity],
      order: [['LocName', 'ASC']]
    });
    return res.status(200).json(loc);
  } catch (error) {
    console.error("Error in locSelect:", error);
    return res.status(500).json({ error: "Failed to fetch locations" });
  }
};

export const locInsert = async (req, res) => {
  const { locname, loccolor, entid } = req.body;
  if (!locname) return res.status(400).json({ error: "Location name is required" });
  try {
    const newLoc = await Location.create({
      LocName: locname,
      LocColor: loccolor || '#4e73df',
      EntID: entid || null
    });
    return res.status(201).json({ msg: "Location created successfully", location: newLoc });
  } catch (error) {
    console.error("Error in locInsert:", error);
    return res.status(500).json({ error: "Failed to create location" });
  }
};

export const locUpdate = async (req, res) => {
  const { locid } = req.params;
  const { locname, loccolor, entid } = req.body;
  try {
    await Location.update(
      { LocName: locname, LocColor: loccolor, EntID: entid || null },
      { where: { LocID: locid } }
    );
    return res.status(200).json({ msg: "Location updated successfully" });
  } catch (error) {
    console.error("Error in locUpdate:", error);
    return res.status(500).json({ error: "Failed to update location" });
  }
};

export const locDelete = async (req, res) => {
  const { locid } = req.params;
  try {
    await Location.destroy({ where: { LocID: locid } });
    return res.status(200).json({ msg: "Location deleted successfully" });
  } catch (error) {
    console.error("Error in locDelete:", error);
    return res.status(500).json({ error: "Failed to delete location" });
  }
};

// =============================================================================
// Material Controllers (Hotel Assets)
// =============================================================================
export const matSelect = async (req, res) => {
  try {
    const mat = await Material.findAll({ order: [['MatName', 'ASC']] });
    return res.status(200).json(mat);
  } catch (error) {
    console.error("Error in matSelect:", error);
    return res.status(500).json({ error: "Failed to fetch materials" });
  }
};

export const matUnuSelect = async (req, res) => {
  Material.hasMany(RealEstate, { foreignKey: 'MatID' });
  RealEstate.belongsTo(Material, { foreignKey: 'MatID' });
  try {
    const mat = await Material.findAll({
      where: { '$realestates.MatID$': null },
      include: [RealEstate]
    });
    return res.status(200).json(mat);
  } catch (error) {
    console.error("Error in matUnuSelect:", error);
    return res.status(500).json({ error: "Failed to fetch unallocated materials" });
  }
};

export const matInsert = async (req, res) => {
  const { matname, matprice, matdate, matimg, category, usefullifeyears, salvagevalue } = req.body;
  if (!matname) return res.status(400).json({ error: "Asset name is required" });
  try {
    const newMat = await Material.create({
      MatName: matname,
      MatPrice: matprice || 0.00,
      MatDate: matdate || new Date().toISOString().slice(0, 10),
      MatImg: matimg || null,
      Category: category || 'General',
      UsefulLifeYears: usefullifeyears || 5,
      SalvageValue: salvagevalue || 0.00
    });
    return res.status(201).json({ msg: "Material created successfully", material: newMat });
  } catch (error) {
    console.error("Error in matInsert:", error);
    return res.status(500).json({ error: "Failed to create material" });
  }
};

export const matUpdate = async (req, res) => {
  const { matid } = req.params;
  const { matname, matprice, matdate, matimg, category, usefullifeyears, salvagevalue } = req.body;
  try {
    const updateObj = {};
    if (matname !== undefined) updateObj.MatName = matname;
    if (matprice !== undefined) updateObj.MatPrice = matprice;
    if (matdate !== undefined) updateObj.MatDate = matdate;
    if (matimg !== undefined) updateObj.MatImg = matimg;
    if (category !== undefined) updateObj.Category = category;
    if (usefullifeyears !== undefined) updateObj.UsefulLifeYears = usefullifeyears;
    if (salvagevalue !== undefined) updateObj.SalvageValue = salvagevalue;

    await Material.update(updateObj, { where: { MatID: matid } });
    return res.status(200).json({ msg: "Material updated successfully" });
  } catch (error) {
    console.error("Error in matUpdate:", error);
    return res.status(500).json({ error: "Failed to update material" });
  }
};

export const matDelete = async (req, res) => {
  const { matid } = req.params;
  try {
    await Material.destroy({ where: { MatID: matid } });
    return res.status(200).json({ msg: "Material deleted successfully" });
  } catch (error) {
    console.error("Error in matDelete:", error);
    return res.status(500).json({ error: "Failed to delete material" });
  }
};

// =============================================================================
// RealEstate Controllers (Allocations)
// =============================================================================
Material.hasMany(RealEstate, { foreignKey: 'MatID' });
RealEstate.belongsTo(Material, { foreignKey: 'MatID' });
Location.hasMany(RealEstate, { foreignKey: 'LocID' });
RealEstate.belongsTo(Location, { foreignKey: 'LocID' });

export const resSelect = async (req, res) => {
  try {
    const rest = await RealEstate.findAll({
      include: [Material, Location],
      order: [[Location, 'LocName', 'ASC']]
    });
    return res.status(200).json(rest);
  } catch (error) {
    console.error("Error in resSelect:", error);
    return res.status(500).json({ error: "Failed to fetch room allocations" });
  }
};

export const resInsert = async (req, res) => {
  const { matid, locid, resqty } = req.body;
  const qty = parseInt(resqty) || 1;
  try {
    const rescheck = await RealEstate.findOne({ where: { MatID: matid, LocID: locid } });
    if (!rescheck) {
      await RealEstate.create({ MatID: matid, LocID: locid, ResQty: qty });
    } else {
      await RealEstate.update(
        { ResQty: Sequelize.literal(`ResQty + ${qty}`) },
        { where: { MatID: matid, LocID: locid } }
      );
    }
    return res.status(200).json({ msg: "Asset allocation updated successfully" });
  } catch (error) {
    console.error("Error in resInsert:", error);
    return res.status(500).json({ error: "Failed to allocate asset" });
  }
};

// =============================================================================
// Transfert Controllers
// =============================================================================
Material.hasMany(Transfert, { foreignKey: 'MatID' });
Transfert.belongsTo(Material, { foreignKey: 'MatID' });
User.hasMany(Transfert, { foreignKey: 'UserID' });
Transfert.belongsTo(User, { foreignKey: 'UserID' });

export const transSelect = async (req, res) => {
  try {
    const trans = await Transfert.findAll({
      attributes: {
        include: [
          [Sequelize.literal('(SELECT LocName FROM location WHERE location.LocID = transfert.LocSend)'), 'LocNameSend'],
          [Sequelize.literal('(SELECT LocName FROM location WHERE location.LocID = transfert.LocRecip)'), 'LocNameRecip']
        ]
      },
      include: [Material, User],
      order: [['TransID', 'DESC']]
    });
    return res.status(200).json(trans);
  } catch (error) {
    console.error("Error in transSelect:", error);
    return res.status(500).json({ error: "Failed to fetch transfers" });
  }
};

export const transInsert = async (req, res) => {
  const { transqty, matid, locsend, locrecip, uidact } = req.body;
  const qty = parseInt(transqty) || 1;
  const t = await db.transaction();

  try {
    // 1. Check sender stock
    const senderStock = await RealEstate.findOne({
      where: { MatID: matid, LocID: locsend },
      transaction: t
    });

    if (!senderStock || senderStock.ResQty < qty) {
      await t.rollback();
      return res.status(400).json({ error: "Insufficient stock in sending location" });
    }

    // 2. Log Transfer
    await Transfert.create({
      TransQty: qty,
      MatID: matid,
      LocSend: locsend,
      LocRecip: locrecip,
      UserID: uidact || null
    }, { transaction: t });

    // 3. Decrement sender stock
    await RealEstate.update(
      { ResQty: Sequelize.literal(`ResQty - ${qty}`) },
      { where: { MatID: matid, LocID: locsend }, transaction: t }
    );

    // 4. Clean up empty sender records
    await RealEstate.destroy({
      where: { MatID: matid, LocID: locsend, ResQty: { [Sequelize.Op.lte]: 0 } },
      transaction: t
    });

    // 5. Increment or create recipient stock
    const recipientStock = await RealEstate.findOne({
      where: { MatID: matid, LocID: locrecip },
      transaction: t
    });

    if (!recipientStock) {
      await RealEstate.create({ MatID: matid, LocID: locrecip, ResQty: qty }, { transaction: t });
    } else {
      await RealEstate.update(
        { ResQty: Sequelize.literal(`ResQty + ${qty}`) },
        { where: { MatID: matid, LocID: locrecip }, transaction: t }
      );
    }

    // 6. Audit log
    await AuditLog.create({
      UserID: uidact || null,
      Action: 'ASSET_TRANSFER',
      EntityType: 'Transfert',
      Details: `Transferred ${qty}x asset #${matid} from location #${locsend} to #${locrecip}`,
      IpAddress: req.ip
    }, { transaction: t });

    await t.commit();
    return res.status(200).json({ msg: "Transfer completed successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Error in transInsert:", error);
    return res.status(500).json({ error: "Failed to execute transfer" });
  }
};

// =============================================================================
// OutStock Controllers (Decommissioning)
// =============================================================================
Material.hasMany(OutStock, { foreignKey: 'MatID' });
OutStock.belongsTo(Material, { foreignKey: 'MatID' });
Location.hasMany(OutStock, { foreignKey: 'LocID' });
OutStock.belongsTo(Location, { foreignKey: 'LocID' });
User.hasMany(OutStock, { foreignKey: 'UserID' });
OutStock.belongsTo(User, { foreignKey: 'UserID' });

export const outSelect = async (req, res) => {
  try {
    const out = await OutStock.findAll({
      include: [Material, Location, User],
      order: [['OutID', 'DESC']]
    });
    return res.status(200).json(out);
  } catch (error) {
    console.error("Error in outSelect:", error);
    return res.status(500).json({ error: "Failed to fetch out-of-stock records" });
  }
};

export const outInsert = async (req, res) => {
  const { outqty, outmotiv, matid, locid, uidact } = req.body;
  const qty = parseInt(outqty) || 1;
  const t = await db.transaction();

  try {
    // 1. Verify availability
    const stock = await RealEstate.findOne({
      where: { MatID: matid, LocID: locid },
      transaction: t
    });

    if (!stock || stock.ResQty < qty) {
      await t.rollback();
      return res.status(400).json({ error: "Insufficient stock to decommission" });
    }

    // 2. Log OutStock
    await OutStock.create({
      OutQty: qty,
      OutMotiv: outmotiv || 'Damaged/Discarded',
      MatID: matid,
      LocID: locid,
      UserID: uidact || null
    }, { transaction: t });

    // 3. Decrement stock
    await RealEstate.update(
      { ResQty: Sequelize.literal(`ResQty - ${qty}`) },
      { where: { MatID: matid, LocID: locid }, transaction: t }
    );

    await RealEstate.destroy({
      where: { MatID: matid, LocID: locid, ResQty: { [Sequelize.Op.lte]: 0 } },
      transaction: t
    });

    // 4. Audit log
    await AuditLog.create({
      UserID: uidact || null,
      Action: 'ASSET_DECOMMISSION',
      EntityType: 'OutStock',
      Details: `Decommissioned ${qty}x asset #${matid} from location #${locid}. Reason: ${outmotiv}`,
      IpAddress: req.ip
    }, { transaction: t });

    await t.commit();
    return res.status(200).json({ msg: "Asset successfully decommissioned" });
  } catch (error) {
    await t.rollback();
    console.error("Error in outInsert:", error);
    return res.status(500).json({ error: "Failed to decommission asset" });
  }
};

// =============================================================================
// User Controllers
// =============================================================================
User.hasMany(Transfert, { foreignKey: 'UserID' });
Transfert.belongsTo(User, { foreignKey: 'UserID' });
User.hasMany(OutStock, { foreignKey: 'UserID' });
OutStock.belongsTo(User, { foreignKey: 'UserID' });

export const userSelect = async (req, res) => {
  try {
    const user = await User.findAll({
      attributes: {
        include: [
          [Sequelize.fn('COUNT', Sequelize.col('transferts.UserID')), 'UTCount'],
          [Sequelize.fn('COUNT', Sequelize.col('outstocks.UserID')), 'UOCount']
        ],
        exclude: ['UserPword', 'refresh_token']
      },
      include: [Transfert, OutStock],
      group: ['user.UserID'],
      order: [['UserName', 'ASC']]
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in userSelect:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const userInsert = async (req, res) => {
  const { username, usertype, userpword } = req.body;
  if (!username || !userpword) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashpword = await bcrypt.hash(userpword, salt);
    const newUser = await User.create({
      UserName: username,
      UserType: usertype || 'User',
      UserPword: hashpword
    });
    return res.status(201).json({ msg: "User created successfully", user: { UserID: newUser.UserID, UserName: newUser.UserName } });
  } catch (error) {
    console.error("Error in userInsert:", error);
    return res.status(500).json({ error: "Failed to create user (username may already exist)" });
  }
};

export const userUpdate = async (req, res) => {
  const { userid } = req.params;
  const { username, userpword, usertype } = req.body;
  try {
    const updateData = {};
    if (username) updateData.UserName = username;
    if (usertype) updateData.UserType = usertype;
    if (userpword && userpword.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.UserPword = await bcrypt.hash(userpword, salt);
    }
    await User.update(updateData, { where: { UserID: userid } });
    return res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    console.error("Error in userUpdate:", error);
    return res.status(500).json({ error: "Failed to update user" });
  }
};

export const userDelete = async (req, res) => {
  const { userid } = req.params;
  try {
    await User.destroy({ where: { UserID: userid } });
    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("Error in userDelete:", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
};

// =============================================================================
// Advanced Analytics & Depreciation Engine
// =============================================================================
export const dashboardStats = async (req, res) => {
  try {
    const [totalMaterials] = await db.query('SELECT COUNT(*) AS count, IFNULL(SUM(MatPrice), 0) AS totalValue FROM material');
    const [totalUnits] = await db.query('SELECT IFNULL(SUM(ResQty), 0) AS units FROM realestate');
    const [totalLocations] = await db.query('SELECT COUNT(*) AS count FROM location');
    const [totalEntities] = await db.query('SELECT COUNT(*) AS count FROM entity');
    const [activeMaintenance] = await db.query("SELECT COUNT(*) AS count FROM maintenance WHERE MaintStatus != 'Completed'");
    const [totalTransfers] = await db.query('SELECT COUNT(*) AS count FROM transfert');
    const [totalOutStocks] = await db.query('SELECT COUNT(*) AS count FROM outstock');

    // Allocation by location
    const [allocationByLocation] = await db.query(`
      SELECT l.LocName, l.LocColor, IFNULL(SUM(r.ResQty), 0) as totalItems, IFNULL(SUM(r.ResQty * m.MatPrice), 0) as roomValue
      FROM location l
      LEFT JOIN realestate r ON l.LocID = r.LocID
      LEFT JOIN material m ON r.MatID = m.MatID
      GROUP BY l.LocID, l.LocName, l.LocColor
      ORDER BY totalItems DESC
      LIMIT 10
    `);

    // Category breakdown
    const [categoryBreakdown] = await db.query(`
      SELECT IFNULL(Category, 'General') AS Category, COUNT(*) AS count, SUM(MatPrice) AS value
      FROM material
      GROUP BY Category
    `);

    const [recentTransfers] = await db.query(`
      SELECT t.TransID, t.TransDate, t.TransQty, m.MatName,
             ls.LocName AS FromRoom, lr.LocName AS ToRoom
      FROM transfert t
      JOIN material m ON m.MatID = t.MatID
      JOIN location ls ON ls.LocID = t.LocSend
      JOIN location lr ON lr.LocID = t.LocRecip
      ORDER BY t.TransDate DESC
      LIMIT 6
    `);

    return res.status(200).json({
      totalMaterials: totalMaterials[0]?.count || 0,
      totalAssetValue: parseFloat(totalMaterials[0]?.totalValue || 0),
      totalUnits: parseInt(totalUnits[0]?.units || 0),
      totalLocations: totalLocations[0]?.count || 0,
      totalEntities: totalEntities[0]?.count || 0,
      activeMaintenance: activeMaintenance[0]?.count || 0,
      totalTransfers: totalTransfers[0]?.count || 0,
      totalOutStocks: totalOutStocks[0]?.count || 0,
      allocationByLocation,
      categoryBreakdown,
      recentTransfers
    });
  } catch (error) {
    console.error("Error in dashboardStats:", error);
    return res.status(500).json({ error: "Failed to generate dashboard statistics" });
  }
};

export const depreciationReport = async (req, res) => {
  try {
    const materials = await Material.findAll();
    const currentDate = new Date();

    const report = materials.map(mat => {
      const price = parseFloat(mat.MatPrice) || 0;
      const salvage = parseFloat(mat.SalvageValue) || 0;
      const usefulYears = parseInt(mat.UsefulLifeYears) || 5;

      let ageYears = 0;
      if (mat.MatDate) {
        const acquireDate = new Date(mat.MatDate);
        const diffMs = currentDate - acquireDate;
        ageYears = Math.max(0, diffMs / (1000 * 60 * 60 * 24 * 365.25));
      }

      const depreciableAmount = Math.max(0, price - salvage);
      const annualDepreciation = depreciableAmount / usefulYears;
      const accumulatedDepreciation = Math.min(depreciableAmount, ageYears * annualDepreciation);
      const currentBookValue = Math.max(salvage, price - accumulatedDepreciation);
      const isFullyDepreciated = ageYears >= usefulYears;

      return {
        MatID: mat.MatID,
        MatName: mat.MatName,
        Category: mat.Category,
        MatDate: mat.MatDate,
        InitialPrice: price,
        SalvageValue: salvage,
        UsefulLifeYears: usefulYears,
        AgeYears: parseFloat(ageYears.toFixed(2)),
        AnnualDepreciation: parseFloat(annualDepreciation.toFixed(2)),
        AccumulatedDepreciation: parseFloat(accumulatedDepreciation.toFixed(2)),
        CurrentBookValue: parseFloat(currentBookValue.toFixed(2)),
        Status: isFullyDepreciated ? 'Fully Depreciated' : 'Active'
      };
    });

    const totalInitial = report.reduce((sum, r) => sum + r.InitialPrice, 0);
    const totalCurrent = report.reduce((sum, r) => sum + r.CurrentBookValue, 0);
    const totalAccumulated = report.reduce((sum, r) => sum + r.AccumulatedDepreciation, 0);

    return res.status(200).json({
      summary: {
        totalInitialCost: parseFloat(totalInitial.toFixed(2)),
        totalCurrentBookValue: parseFloat(totalCurrent.toFixed(2)),
        totalAccumulatedDepreciation: parseFloat(totalAccumulated.toFixed(2))
      },
      assets: report
    });
  } catch (error) {
    console.error("Error in depreciationReport:", error);
    return res.status(500).json({ error: "Failed to generate depreciation report" });
  }
};

export const inventoryExport = async (req, res) => {
  try {
    const locid = req.query.locid;
    const params = [];
    let where = "";
    if (locid) {
      where = "WHERE l.LocID = ?";
      params.push(locid);
    }

    const [rows] = await db.query(`
      SELECT l.LocID, l.LocName, IFNULL(e.EntName, '') AS EntName,
             m.MatID, m.MatName, m.MatPrice, r.ResQty,
             (m.MatPrice * r.ResQty) AS LineTotal
      FROM realestate r
      JOIN material m ON m.MatID = r.MatID
      JOIN location l ON l.LocID = r.LocID
      LEFT JOIN entity e ON e.EntID = l.EntID
      ${where}
      ORDER BY l.LocName, m.MatName
    `, { replacements: params });

    const header = ["Location", "Entity", "AssetID", "Asset", "UnitPrice", "Qty", "LineTotal"];
    const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const lines = rows.map((row) => [
      row.LocName, row.EntName, row.MatID, row.MatName, row.MatPrice, row.ResQty, row.LineTotal
    ].map(escape).join(","));

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="room-inventory.csv"');
    return res.status(200).send(["\uFEFF" + header.join(","), ...lines].join("\n"));
  } catch (error) {
    console.error("Error in inventoryExport:", error);
    return res.status(500).json({ error: "Failed to export inventory" });
  }
};

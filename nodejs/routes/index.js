import express from "express";
import { Login, Logout } from "../controllers/Auth.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import {
  entSelect, entInsert, entUpdate, entDelete,
  locSelect, locInsert, locUpdate, locDelete,
  matSelect, matUnuSelect, matInsert, matUpdate, matDelete,
  resSelect, resInsert,
  transSelect, transInsert,
  outSelect, outInsert,
  userSelect, userInsert, userUpdate, userDelete,
  dashboardStats, depreciationReport, inventoryExport
} from "../controllers/Controller.js";
import {
  maintSelect, maintInsert, maintUpdate, maintDelete
} from "../controllers/MaintenanceController.js";

const router = express.Router();

// =============================================================================
// Auth & Token Routes
// =============================================================================
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

// =============================================================================
// User Routes
// =============================================================================
router.get('/userSelect', verifyToken, userSelect);
router.post('/userInsert', userInsert);
router.put('/userUpdate/:userid', verifyToken, userUpdate);
router.delete('/userDelete/:userid', verifyToken, userDelete);

// =============================================================================
// Entity Routes (Buildings / Wings)
// =============================================================================
router.get('/entSelect', entSelect);
router.post('/entInsert', verifyToken, entInsert);
router.put('/entUpdate/:entid', verifyToken, entUpdate);
router.delete('/entDelete/:entid', verifyToken, entDelete);

// =============================================================================
// Location Routes (Hotel Rooms / Areas)
// =============================================================================
router.get('/locSelect', locSelect);
router.post('/locInsert', verifyToken, locInsert);
router.put('/locUpdate/:locid', verifyToken, locUpdate);
router.delete('/locDelete/:locid', verifyToken, locDelete);

// =============================================================================
// Material Routes (Hotel Assets)
// =============================================================================
router.get('/matSelect', matSelect);
router.get('/matUnuSelect', matUnuSelect);
router.post('/matInsert', verifyToken, matInsert);
router.put('/matUpdate/:matid', verifyToken, matUpdate);
router.delete('/matDelete/:matid', verifyToken, matDelete);

// =============================================================================
// RealEstate Routes (Room Inventory Allocation)
// =============================================================================
router.get('/resSelect', resSelect);
router.post('/resInsert', verifyToken, resInsert);

// =============================================================================
// Transfert Routes (Asset Movement between Rooms)
// =============================================================================
router.get('/transSelect', transSelect);
router.post('/transInsert', verifyToken, transInsert);

// =============================================================================
// OutStock Routes (Decommissioning & Damaged)
// =============================================================================
router.get('/outSelect', outSelect);
router.post('/outInsert', verifyToken, outInsert);

// =============================================================================
// Maintenance Routes [NEW]
// =============================================================================
router.get('/maintSelect', maintSelect);
router.post('/maintInsert', verifyToken, maintInsert);
router.put('/maintUpdate/:maintid', verifyToken, maintUpdate);
router.delete('/maintDelete/:maintid', verifyToken, maintDelete);

// =============================================================================
// Analytics & Financial Reports [NEW]
// =============================================================================
router.get('/dashboardStats', dashboardStats);
router.get('/depreciationReport', depreciationReport);
router.get('/inventoryExport', inventoryExport);

export default router;

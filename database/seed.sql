-- =============================================================================
-- Hotel Asset Management System - Seed Data (db_material)
-- =============================================================================

USE `db_material`;

-- -----------------------------------------------------------------------------
-- Default Users (Password for all is 'admin123' hashed with bcrypt)
-- -----------------------------------------------------------------------------
INSERT INTO `user` (`UserID`, `UserName`, `UserPword`, `UserType`) VALUES
  (1, 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin'),
  (2, 'manager', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin'),
  (3, 'housekeeping', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'User'),
  (4, 'maintenance', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'User')
ON DUPLICATE KEY UPDATE `UserName` = VALUES(`UserName`);

-- -----------------------------------------------------------------------------
-- Hotel Entities / Buildings
-- -----------------------------------------------------------------------------
INSERT INTO `entity` (`EntID`, `EntName`, `EntDesc`) VALUES
  (1, 'Main Palace', 'Main hotel building, reception, and luxury suites'),
  (2, 'Beach Villas', 'Private oceanfront bungalows and infinity villas'),
  (3, 'Wellness Spa', 'Spa, indoor thermal pool, sauna, and fitness club'),
  (4, 'Grand Restaurant', 'Main gourmet dining, banquet hall, and kitchens')
ON DUPLICATE KEY UPDATE `EntName` = VALUES(`EntName`);

-- -----------------------------------------------------------------------------
-- Locations / Hotel Rooms
-- -----------------------------------------------------------------------------
INSERT INTO `location` (`LocID`, `LocName`, `LocColor`, `EntID`) VALUES
  (1, 'Suite 501 Presidential', '#4e73df', 1),
  (2, 'Suite 502 Royal', '#1cc88a', 1),
  (3, 'Room 201 Deluxe Ocean', '#36b9cc', 1),
  (4, 'Room 202 Deluxe Garden', '#f6c23e', 1),
  (5, 'Villa 01 Sunset Palm', '#e74a3b', 2),
  (6, 'Villa 02 Coral Cove', '#858796', 2),
  (7, 'Spa Treatment Room 3', '#6f42c1', 3),
  (8, 'Central Asset Storage', '#5a5c69', 1)
ON DUPLICATE KEY UPDATE `LocName` = VALUES(`LocName`);

-- -----------------------------------------------------------------------------
-- Materials / Hotel Assets Catalog
-- -----------------------------------------------------------------------------
INSERT INTO `material` (`MatID`, `MatName`, `MatPrice`, `MatDate`, `Category`, `UsefulLifeYears`, `SalvageValue`) VALUES
  (1, 'Smart TV Samsung 65" 4K QLED', 1200.00, '2023-01-15', 'Electronics', 5, 150.00),
  (2, 'Nespresso Zenius Coffee Machine', 450.00, '2023-02-10', 'Appliances', 4, 50.00),
  (3, 'Dometic Silent Minibar 40L', 380.00, '2022-11-20', 'Appliances', 6, 40.00),
  (4, 'Electronic Safe Yale Laptop Size', 220.00, '2022-09-05', 'Security', 8, 30.00),
  (5, 'King Size Premium Boxspring Bed', 1850.00, '2023-03-01', 'Furniture', 10, 200.00),
  (6, 'Ergonomic Desk & Herman Miller Chair', 950.00, '2023-04-12', 'Furniture', 7, 100.00),
  (7, 'Bose SoundLink Bluetooth Speaker', 250.00, '2023-05-18', 'Audio', 4, 30.00),
  (8, 'Dyson Supersonic Pro Hairdryer', 399.00, '2023-06-25', 'Bathroom', 3, 50.00)
ON DUPLICATE KEY UPDATE `MatName` = VALUES(`MatName`);

-- -----------------------------------------------------------------------------
-- RealEstate / Initial Room Allocations
-- -----------------------------------------------------------------------------
INSERT INTO `realestate` (`MatID`, `LocID`, `ResQty`) VALUES
  (1, 1, 2), -- Suite 501 has 2 Samsung TVs
  (2, 1, 1), -- Suite 501 has 1 Nespresso
  (3, 1, 1), -- Suite 501 has 1 Minibar
  (4, 1, 1), -- Suite 501 has 1 Safe
  (5, 1, 1), -- Suite 501 has 1 King Bed
  (1, 2, 1), -- Suite 502 has 1 Samsung TV
  (3, 2, 1), -- Suite 502 has 1 Minibar
  (4, 2, 1), -- Suite 502 has 1 Safe
  (5, 2, 1), -- Suite 502 has 1 King Bed
  (1, 3, 1), -- Room 201 has 1 Samsung TV
  (3, 3, 1), -- Room 201 has 1 Minibar
  (1, 8, 4), -- Central Storage has 4 spare TVs
  (2, 8, 3)  -- Central Storage has 3 spare Coffee Machines
ON DUPLICATE KEY UPDATE `ResQty` = VALUES(`ResQty`);

-- -----------------------------------------------------------------------------
-- Sample Asset Transfer History
-- -----------------------------------------------------------------------------
INSERT INTO `transfert` (`TransID`, `TransDate`, `TransQty`, `MatID`, `LocSend`, `LocRecip`, `UserID`) VALUES
  (1, '2024-01-10 10:30:00', 1, 1, 8, 1, 1),
  (2, '2024-01-15 14:15:00', 1, 2, 8, 1, 1),
  (3, '2024-02-01 09:00:00', 1, 3, 8, 3, 1)
ON DUPLICATE KEY UPDATE `TransQty` = VALUES(`TransQty`);

-- -----------------------------------------------------------------------------
-- Sample OutStock / Decommissioning History
-- -----------------------------------------------------------------------------
INSERT INTO `outstock` (`OutID`, `OutDate`, `OutQty`, `OutMotiv`, `MatID`, `LocID`, `UserID`) VALUES
  (1, '2024-02-20 16:45:00', 1, 'Screen cracked by guest', 1, 4, 1)
ON DUPLICATE KEY UPDATE `OutQty` = VALUES(`OutQty`);

-- -----------------------------------------------------------------------------
-- Sample Maintenance Logs
-- -----------------------------------------------------------------------------
INSERT INTO `maintenance` (`MaintID`, `MatID`, `LocID`, `MaintType`, `MaintDesc`, `MaintCost`, `MaintStatus`, `ScheduledDate`, `CompletedDate`, `Technician`, `UserID`) VALUES
  (1, 3, 1, 'Preventive', 'Annual refrigerant recharge and thermostat calibration', 45.00, 'Completed', '2024-01-20', '2024-01-21', 'Marc Dupont', 1),
  (2, 2, 1, 'Corrective', 'Descaling and pump pressure fix', 35.00, 'Completed', '2024-02-05', '2024-02-05', 'Alain R.', 1),
  (3, 1, 2, 'Inspection', 'Quarterly HDMI & Smart Hub connectivity firmware check', 0.00, 'Scheduled', '2024-12-01', NULL, 'Technic Service', 1)
ON DUPLICATE KEY UPDATE `MaintDesc` = VALUES(`MaintDesc`);

-- -----------------------------------------------------------------------------
-- Initial Audit Log
-- -----------------------------------------------------------------------------
INSERT INTO `audit_log` (`UserID`, `Action`, `EntityType`, `Details`, `IpAddress`) VALUES
  (1, 'SYSTEM_INIT', 'Database', 'Initial hotel asset database and seed populated', '127.0.0.1');

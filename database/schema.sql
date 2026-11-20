-- =============================================================================
-- Hotel Asset Management System - Database Schema (db_material)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `db_material`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `db_material`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `audit_log`;
DROP TABLE IF EXISTS `maintenance`;
DROP TABLE IF EXISTS `outstock`;
DROP TABLE IF EXISTS `transfert`;
DROP TABLE IF EXISTS `realestate`;
DROP TABLE IF EXISTS `material`;
DROP TABLE IF EXISTS `location`;
DROP TABLE IF EXISTS `entity`;
DROP TABLE IF EXISTS `user`;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. Table: user (Staff and Management Accounts)
-- -----------------------------------------------------------------------------
CREATE TABLE `user` (
  `UserID` INT AUTO_INCREMENT NOT NULL,
  `UserName` VARCHAR(50) NOT NULL,
  `UserPword` VARCHAR(255) NOT NULL,
  `UserType` VARCHAR(20) NOT NULL DEFAULT 'User',
  `refresh_token` TEXT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `uk_username` (`UserName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: entity (Hotel Complexes, Wings, Pavilions)
-- -----------------------------------------------------------------------------
CREATE TABLE `entity` (
  `EntID` INT AUTO_INCREMENT NOT NULL,
  `EntName` VARCHAR(50) NOT NULL,
  `EntDesc` VARCHAR(255) NULL,
  PRIMARY KEY (`EntID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: location (Rooms, Suites, Departments, Storage Areas)
-- -----------------------------------------------------------------------------
CREATE TABLE `location` (
  `LocID` INT AUTO_INCREMENT NOT NULL,
  `LocName` VARCHAR(50) NOT NULL,
  `LocColor` VARCHAR(7) DEFAULT '#4e73df',
  `EntID` INT NULL,
  PRIMARY KEY (`LocID`),
  KEY `idx_location_entity` (`EntID`),
  CONSTRAINT `fk_location_entity` FOREIGN KEY (`EntID`) REFERENCES `entity` (`EntID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Table: material (Hotel Asset Catalog / Equipment)
-- -----------------------------------------------------------------------------
CREATE TABLE `material` (
  `MatID` INT AUTO_INCREMENT NOT NULL,
  `MatName` VARCHAR(100) NOT NULL,
  `MatPrice` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `MatDate` DATE NULL,
  `MatImg` LONGTEXT NULL,
  `Category` VARCHAR(50) DEFAULT 'General',
  `UsefulLifeYears` INT DEFAULT 5,
  `SalvageValue` DECIMAL(12, 2) DEFAULT 0.00,
  PRIMARY KEY (`MatID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Table: realestate (Inventory / Current Asset Allocation per Room)
-- -----------------------------------------------------------------------------
CREATE TABLE `realestate` (
  `MatID` INT NOT NULL,
  `LocID` INT NOT NULL,
  `ResQty` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`MatID`, `LocID`),
  KEY `idx_realestate_location` (`LocID`),
  CONSTRAINT `fk_realestate_material` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_realestate_location` FOREIGN KEY (`LocID`) REFERENCES `location` (`LocID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Table: transfert (Asset Relocation History between Rooms)
-- -----------------------------------------------------------------------------
CREATE TABLE `transfert` (
  `TransID` INT AUTO_INCREMENT NOT NULL,
  `TransDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `TransQty` INT NOT NULL,
  `MatID` INT NOT NULL,
  `LocSend` INT NOT NULL,
  `LocRecip` INT NOT NULL,
  `UserID` INT NULL,
  PRIMARY KEY (`TransID`),
  KEY `idx_transfert_material` (`MatID`),
  KEY `idx_transfert_send` (`LocSend`),
  KEY `idx_transfert_recip` (`LocRecip`),
  KEY `idx_transfert_user` (`UserID`),
  CONSTRAINT `fk_transfert_material` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_transfert_locsend` FOREIGN KEY (`LocSend`) REFERENCES `location` (`LocID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_transfert_locrecip` FOREIGN KEY (`LocRecip`) REFERENCES `location` (`LocID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_transfert_user` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Table: outstock (Asset Decommissioning, Damage & Write-offs)
-- -----------------------------------------------------------------------------
CREATE TABLE `outstock` (
  `OutID` INT AUTO_INCREMENT NOT NULL,
  `OutDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `OutQty` INT NOT NULL,
  `OutMotiv` VARCHAR(100) NOT NULL,
  `MatID` INT NOT NULL,
  `LocID` INT NOT NULL,
  `UserID` INT NULL,
  PRIMARY KEY (`OutID`),
  KEY `idx_outstock_material` (`MatID`),
  KEY `idx_outstock_location` (`LocID`),
  KEY `idx_outstock_user` (`UserID`),
  CONSTRAINT `fk_outstock_material` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_outstock_location` FOREIGN KEY (`LocID`) REFERENCES `location` (`LocID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_outstock_user` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. Table: maintenance [ADVANCED FEATURE]
-- -----------------------------------------------------------------------------
CREATE TABLE `maintenance` (
  `MaintID` INT AUTO_INCREMENT NOT NULL,
  `MatID` INT NOT NULL,
  `LocID` INT NOT NULL,
  `MaintType` ENUM('Preventive', 'Corrective', 'Inspection') NOT NULL DEFAULT 'Corrective',
  `MaintDesc` TEXT NOT NULL,
  `MaintCost` DECIMAL(10, 2) DEFAULT 0.00,
  `MaintStatus` ENUM('Scheduled', 'In Progress', 'Completed') DEFAULT 'Scheduled',
  `ScheduledDate` DATE NOT NULL,
  `CompletedDate` DATE NULL,
  `Technician` VARCHAR(100) NULL,
  `UserID` INT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`MaintID`),
  KEY `idx_maint_material` (`MatID`),
  KEY `idx_maint_location` (`LocID`),
  CONSTRAINT `fk_maint_material` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_maint_location` FOREIGN KEY (`LocID`) REFERENCES `location` (`LocID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_maint_user` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. Table: audit_log [ADVANCED SECURITY]
-- -----------------------------------------------------------------------------
CREATE TABLE `audit_log` (
  `LogID` INT AUTO_INCREMENT NOT NULL,
  `UserID` INT NULL,
  `Action` VARCHAR(50) NOT NULL,
  `EntityType` VARCHAR(50) NOT NULL,
  `Details` TEXT NULL,
  `IpAddress` VARCHAR(45) NULL,
  `CreatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`LogID`),
  KEY `idx_audit_user` (`UserID`),
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

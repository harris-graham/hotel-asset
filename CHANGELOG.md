# Changelog

All notable changes to the Hotel Asset Management System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup and architecture
- Complete database schema with 9 tables (user, entity, location, material, realestate, transfert, outstock, maintenance, audit_log)
- Seed data with realistic hotel entities, rooms, and assets
- Backend API with Express.js and Sequelize ORM
- JWT-based authentication with refresh tokens
- Frontend React application with Bootstrap UI
- Dashboard with interactive analytics charts
- Maintenance tracking system
- Asset depreciation calculator
- QR code generation for asset tags
- CSV export functionality for inventories
- Audit trail for inventory movements
- GitHub Actions CI/CD workflows
- Issue templates and PR template
- Dependabot configuration

### Changed
- Moved asset images from BLOB to file-based storage
- Enhanced database with proper foreign keys and indexes
- Implemented proper HTTP response handling in all controllers
- Added route protection with verifyToken middleware

### Security
- Protected all state-altering API routes with JWT authentication
- Added bcrypt password hashing
- Implemented audit logging for sensitive operations
- Configured CORS policies

## [1.0.0] - 2026-11-20

### Added
- Initial release of Hotel Asset Management System
- Core asset management features (Entities, Locations, Materials, Inventory)
- Asset transfer tracking between locations
- Asset decommissioning (OutStock) functionality
- User management with role-based access control
- Basic dashboard with user table display

### Known Issues
- Dashboard limited to user table display (enhanced in v1.1.0)
- No maintenance tracking (added in v1.1.0)
- No depreciation calculator (added in v1.1.0)
- No QR code tagging (added in v1.1.0)
- Limited export functionality (enhanced in v1.1.0)

## [Unreleased] - Future Enhancements

### Planned
- Mobile-responsive design improvements
- Real-time notifications for maintenance alerts
- Multi-language support (i18n)
- Advanced reporting with scheduled email reports
- Integration with hotel PMS (Property Management System)
- Barcode scanner integration
- Asset lifecycle management
- Vendor management for procurement
- Budget tracking and forecasting
- Mobile app (React Native)

---

## Version History Summary

| Version | Date | Major Changes |
|---------|------|---------------|
| 1.0.0 | 2026-11-20 | Initial release with core asset management |
| 1.1.0 | TBD | Advanced features: maintenance, depreciation, QR codes, analytics |
| 2.0.0 | TBD | Major architecture overhaul and new features |

---

## Categories

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security-related changes

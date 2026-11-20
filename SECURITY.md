# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Hotel Asset Management System team takes security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Do NOT open a public issue for security vulnerabilities.**

Instead, please send an email to: **security@yourdomain.com**

Include the following information in your report:

1. **Description**: A clear description of the vulnerability
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Impact**: Potential impact of the vulnerability
4. **Proof of Concept**: If possible, provide a proof of concept
5. **Affected Versions**: Which versions are affected

### What to Expect

- You will receive an acknowledgment within 48 hours
- We will validate the reported vulnerability
- We will work on a fix and coordinate release with you
- We will credit you in the security advisory (unless you prefer to remain anonymous)

### Security Best Practices for Contributors

When contributing to the project, please follow these security guidelines:

#### Authentication & Authorization

- Never hardcode credentials in the codebase
- Use environment variables for sensitive data (API keys, database passwords, JWT secrets)
- Always validate and sanitize user input
- Implement proper rate limiting on authentication endpoints
- Use HTTPS in production environments

#### Database Security

- Use parameterized queries (Sequelize ORM handles this)
- Never expose database errors to the client
- Implement proper user permissions and role-based access control
- Regularly update database drivers and ORM libraries

#### Dependencies

- Keep dependencies up to date
- Review security advisories for dependencies
- Use `npm audit` to check for known vulnerabilities
- Dependabot is configured to automatically alert about dependency updates

#### Code Review

- All code changes must go through pull request review
- Security-sensitive changes require at least two approvers
- Test security-related functionality thoroughly

### Security Features

The Hotel Asset Management System includes the following security features:

- **JWT Authentication**: Secure token-based authentication with access and refresh tokens
- **Password Hashing**: User passwords are hashed using bcrypt
- **Protected Routes**: All state-altering API endpoints require authentication
- **SQL Injection Protection**: Sequelize ORM provides parameterized queries
- **CORS Configuration**: Configurable Cross-Origin Resource Sharing
- **Audit Logging**: Complete audit trail for sensitive operations

### Environment Variables

Ensure the following environment variables are set in production:

```env
# Server
PORT=5000
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=db_material
DB_USER=your_db_user
DB_PASS=your_secure_password

# JWT Secrets (use strong, unique secrets)
ACCESS_TOKEN_SECRET=your_very_long_random_access_token_secret
REFRESH_TOKEN_SECRET=your_very_long_random_refresh_token_secret
```

### Production Deployment Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Set strong JWT secrets
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS to only allow trusted origins
- [ ] Enable database backups
- [ ] Set up monitoring and alerting
- [ ] Review and update firewall rules
- [ ] Disable debug mode
- [ ] Run security audit: `npm audit`
- [ ] Review user permissions and roles

### Disclosure Policy

We follow a coordinated disclosure process:

1. **Initial Report**: Security vulnerability reported
2. **Validation**: Team validates and reproduces the issue
3. **Fix Development**: Team develops a patch
4. **Testing**: Patch is tested thoroughly
5. **Release**: Security update is released
6. **Credit**: Reporter is credited (with permission)
7. **Advisory**: Security advisory is published

We aim to resolve and release security updates within 7-14 days of validation, depending on severity.

### Security Contact

For security-related questions that are not vulnerability reports, please contact:

- Email: security@yourdomain.com
- PGP Key: [Add your PGP key fingerprint here]

Thank you for helping keep the Hotel Asset Management System secure!

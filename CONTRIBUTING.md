# Contributing to Hotel Asset Management System

Thank you for your interest in contributing to the Hotel Asset Management System! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MySQL 8.0 or higher
- Git

### Setting Up the Development Environment

1. **Fork the repository**
   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/yourusername/hotel-asset.git
   cd hotel-asset
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd nodejs
   npm install

   # Frontend dependencies
   cd ../reactjs
   npm install
   ```

3. **Set up the database**
   ```bash
   # Create the database schema
   mysql -u root -p < database/schema.sql

   # Load seed data for development
   mysql -u root -p db_material < database/seed.sql
   ```

4. **Configure environment variables**
   ```bash
   cd nodejs
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1: Backend
   cd nodejs
   npm start

   # Terminal 2: Frontend
   cd reactjs
   npm start
   ```

## Development Workflow

### Branching Strategy

We use a simplified Git flow workflow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Creating a Feature Branch

1. Ensure your local `main` is up to date:
   ```bash
   git checkout main
   git pull origin main
   ```

2. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add QR code generation for asset tags
fix: resolve authentication token expiration issue
docs: update API documentation for maintenance endpoints
```

## Pull Request Process

1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Fill out the PR template
   - Link related issues

4. **PR Requirements**
   - All tests must pass
   - Code must pass linting
   - New features must include tests
   - Documentation must be updated
   - Commits must follow the convention

5. **Code Review**
   - Address review feedback promptly
   - Keep discussions focused and constructive
   - Update your branch with `git rebase` if needed

## Coding Standards

### JavaScript/React

- Use ES6+ syntax
- Use functional components with hooks
- Follow Airbnb JavaScript Style Guide
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

Example:
```javascript
/**
 * Calculates straight-line depreciation for an asset
 * @param {number} cost - Original asset cost
 * @param {number} salvageValue - Asset salvage value
 * @param {number} usefulLifeYears - Asset useful life in years
 * @returns {number} Annual depreciation amount
 */
const calculateDepreciation = (cost, salvageValue, usefulLifeYears) => {
  return (cost - salvageValue) / usefulLifeYears;
};
```

### Backend (Node.js/Express)

- Use async/await for asynchronous operations
- Handle errors properly with try-catch
- Return proper HTTP status codes
- Validate input data
- Use Sequelize for database operations

Example:
```javascript
export const createMaterial = async (req, res) => {
  try {
    const { MatName, MatPrice, Category } = req.body;

    if (!MatName || !MatPrice) {
      return res.status(400).json({ error: 'MatName and MatPrice are required' });
    }

    const material = await Material.create({
      MatName,
      MatPrice,
      Category: Category || 'General'
    });

    return res.status(201).json(material);
  } catch (error) {
    console.error('Error creating material:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
```

### Database

- Use parameterized queries (Sequelize handles this)
- Use transactions for multi-table operations
- Add foreign key constraints
- Use appropriate indexes for frequently queried columns

## Testing

### Backend Tests

```bash
cd nodejs
npm test
```

### Frontend Tests

```bash
cd reactjs
npm test
```

### Writing Tests

- Unit tests for individual functions/components
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Aim for >80% code coverage

Example test structure:
```javascript
describe('Material Controller', () => {
  describe('createMaterial', () => {
    it('should create a new material with valid data', async () => {
      const req = { body: { MatName: 'Test TV', MatPrice: 500 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await createMaterial(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 for missing required fields', async () => {
      const req = { body: { MatName: 'Test TV' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await createMaterial(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
```

## Reporting Issues

### Bug Reports

When reporting a bug, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**:
   ```bash
   1. Go to '...'
   2. Click on '....'
   3. Scroll down to '....'
   4. See error
   ```
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Screenshots**: If applicable
6. **Environment**:
   - OS: [e.g., Windows 10, macOS, Ubuntu]
   - Node.js version: [e.g., 18.17.0]
   - Browser: [e.g., Chrome 120]
   - MySQL version: [e.g., 8.0.33]

### Feature Requests

For feature requests, please:

1. Use the feature request issue template
2. Describe the use case clearly
3. Explain why this feature would be valuable
4. Provide examples or mockups if possible

## Questions or Need Help?

- Check existing issues first
- Start a discussion on GitHub Discussions
- Contact maintainers via email

## Recognition

Contributors will be recognized in the project's CONTRIBUTORS file and in release notes.

Thank you for contributing to the Hotel Asset Management System!

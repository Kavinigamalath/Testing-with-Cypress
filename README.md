# Store Management Test Suite

This repository contains automated end-to-end tests for the Store Management application using Cypress.

##  Overview

The test suite covers functional testing for the Store Management system, including user authentication, item creation, validation, and basic web functionality testing.

##  Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Cypress installed
- Local development server running on `http://localhost:5173`

##  Installation

1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Install Cypress (if not already installed)
```bash
npm install cypress --save-dev
# or
yarn add cypress --dev
```

##  Test Structure

```
cypress/
├── fixtures/
│   └── sample.jpg          # Test image file for upload functionality
├── e2e/
│   └── store-management.cy.js  # Main test file
└── support/
    └── commands.js         # Custom Cypress commands
```

##  Test Cases

### Store Management Tests
- **Authentication**: Automated login as Store Admin
- **Item Creation**: Valid item creation with image upload
- **Validation Testing**: Error handling for invalid quantity inputs
- **Navigation**: URL validation and page transitions

### Demo Tests
- **Basic Web Testing**: Example Cypress functionality demonstration

##  Configuration

The test suite is configured with:
- **Base URL**: `http://localhost:5173`
- **Default Command Timeout**: 10 seconds
- **Uncaught Exception Handling**: Disabled for smoother test execution

##  Running Tests

### Open Cypress Test Runner (Interactive Mode)
```bash
npx cypress open
```

### Run Tests in Headless Mode
```bash
npx cypress run
```

### Run Specific Test File
```bash
npx cypress run --spec "cypress/e2e/store-management.cy.js"
```

##  Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Store Admin | Store | Store123 |

##  Required Test Data

Ensure the following files exist in `cypress/fixtures/`:
- `sample.jpg` - Test image for file upload functionality

##  Test Scenarios Covered

1. **User Authentication**
   - Login validation
   - Session management
   - URL redirection

2. **Store Item Management**
   - Form submission with valid data
   - File upload functionality
   - Data validation (quantity field)
   - Success/error message handling

3. **UI Interactions**
   - Form field interactions
   - Button clicks
   - Alert handling (SweetAlert integration)
   - Table data verification

##  Troubleshooting

### Common Issues

1. **Server Not Running**
   - Ensure the development server is running on `http://localhost:5173`

2. **Missing Test Files**
   - Verify `sample.jpg` exists in `cypress/fixtures/`

3. **Timeout Issues**
   - Increase `defaultCommandTimeout` if tests are running slowly

4. **Authentication Failures**
   - Verify test credentials are correct
   - Check if login endpoint is accessible

##  Best Practices

- Tests run with a fresh login session for each test case
- Uncaught exceptions are handled to prevent test interruption
- Explicit waits are used for dynamic content
- Clear, descriptive test names and assertions

##  CI/CD Integration

To integrate with CI/CD pipelines:

```yaml
# Example GitHub Actions snippet
- name: Run Cypress Tests
  run: npx cypress run --browser chrome --headless
```

##  Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Best Practices Guide](https://docs.cypress.io/guides/references/best-practices)
- [Cypress API Reference](https://docs.cypress.io/api/table-of-contents)

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Add/modify tests as needed
4. Ensure all tests pass
5. Submit a pull request

---

**Note**: Make sure your local development environment is running before executing the test suite.

# SkillCircle Testing Suite

This document outlines the comprehensive testing strategy and implementation for the SkillCircle application.

## Overview

The SkillCircle testing suite provides comprehensive coverage across multiple testing levels:

- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test component interactions and API endpoints
- **Performance Tests**: Ensure optimal application performance
- **End-to-End Tests**: Validate complete user workflows

## Test Structure

### Frontend Tests (`/web/src/__tests__/`)

```
__tests__/
├── components/          # Component unit tests
│   ├── auth/           # Authentication components
│   └── layout/         # Layout components
├── contexts/           # React context tests
├── integration/        # Integration tests
├── performance/        # Performance tests
└── utils/             # Test utilities and helpers
```

### Backend Tests (`/backend/__tests__/`)

```
__tests__/
├── routes/            # API route tests
├── middleware/        # Middleware tests
└── integration/       # Server integration tests
```

## Testing Technologies

### Frontend
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **User Event**: User interaction simulation
- **Next.js Testing**: Framework-specific testing support

### Backend
- **Jest**: Test runner and assertion library
- **Supertest**: HTTP assertion library for API testing
- **Node.js Testing**: Server-side testing utilities

## Running Tests

### Frontend Tests

```bash
cd web

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

## Test Categories

### 1. Authentication Tests

**Frontend:**
- Login form validation and submission
- Registration form validation and submission
- Auth context state management
- Token refresh functionality
- Session persistence

**Backend:**
- User registration endpoint
- User login endpoint
- Token validation middleware
- Refresh token management
- Rate limiting

### 2. Navigation Tests

**Frontend:**
- Header component rendering
- Dropdown menu interactions
- Mobile navigation
- Search functionality
- Performance metrics

### 3. Integration Tests

**Frontend:**
- Complete authentication flows
- API integration
- Error handling
- Loading states

**Backend:**
- Full server functionality
- CORS handling
- Error responses
- Security headers

### 4. Performance Tests

**Frontend:**
- Component render times
- Interaction responsiveness
- Memory usage
- Bundle size impact

**Backend:**
- Response times
- Concurrent request handling
- Load testing
- Memory leaks

## Test Utilities

### Frontend Test Utilities (`test-utils.tsx`)

```typescript
import { renderWithProviders, mockUser, mockFetch } from './utils/test-utils'

// Render component with auth context
const { getByText } = renderWithProviders(<Component />, {
  isAuthenticated: true,
  authContext: { user: mockUser }
})

// Mock API responses
mockFetch({ success: true, user: mockUser })
```

### Common Test Patterns

#### Testing Components with Authentication

```typescript
it('should render authenticated content', () => {
  renderWithProviders(<ProtectedComponent />, {
    isAuthenticated: true
  })

  expect(screen.getByText('Welcome back!')).toBeInTheDocument()
})
```

#### Testing API Interactions

```typescript
it('should handle login successfully', async () => {
  mockFetch(createMockAuthResponse())

  // Perform login action
  // Assert success state
})
```

#### Testing Form Validation

```typescript
it('should validate email format', async () => {
  render(<LoginForm />)

  const emailInput = screen.getByPlaceholderText('Enter your email')
  fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
  fireEvent.blur(emailInput)

  await waitFor(() => {
    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument()
  })
})
```

## Coverage Requirements

### Minimum Coverage Thresholds

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Coverage Reports

Coverage reports are generated in the `coverage/` directory and include:
- HTML reports for detailed analysis
- LCOV format for CI/CD integration
- Text summary for quick overview

## Continuous Integration

### GitHub Actions Integration

Tests are automatically run on:
- Pull requests
- Pushes to main branch
- Scheduled nightly runs

### Test Commands for CI

```yaml
# Frontend tests
- run: cd web && npm ci
- run: cd web && npm run test:ci

# Backend tests
- run: cd backend && npm ci
- run: cd backend && npm run test:ci
```

## Performance Benchmarks

### Frontend Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| Component Render | < 50ms | < 100ms |
| Dropdown Open | < 100ms | < 200ms |
| Form Validation | < 50ms | < 100ms |
| Navigation | < 100ms | < 200ms |

### Backend Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| Health Check | < 50ms | < 100ms |
| Authentication | < 200ms | < 500ms |
| API Response | < 300ms | < 1000ms |
| Concurrent Requests | 20+ | 10+ |

## Test Data Management

### Mock Data

All test data is generated using utility functions to ensure:
- Consistency across tests
- Isolation between test runs
- Realistic test scenarios

### Test Database

Backend tests use in-memory data structures to avoid:
- Database dependencies
- Test data pollution
- Slow test execution

## Debugging Tests

### Common Issues

1. **Async/Await Issues**: Use `waitFor` for async operations
2. **Component Cleanup**: Ensure proper test isolation
3. **Mock Cleanup**: Clear mocks between tests
4. **Timer Issues**: Use `jest.useFakeTimers()` when needed

### Debug Commands

```bash
# Run specific test file
npm test -- LoginForm.test.tsx

# Run tests in verbose mode
npm test -- --verbose

# Run tests with debugging
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Best Practices

### Test Structure

1. **Arrange**: Set up test data and mocks
2. **Act**: Execute the functionality being tested
3. **Assert**: Verify the expected outcome

### Test Naming

- Use descriptive test names that explain the scenario
- Follow the pattern: "should [expected behavior] when [condition]"
- Group related tests using `describe` blocks

### Test Isolation

- Each test should be independent
- Use `beforeEach` and `afterEach` for setup/cleanup
- Clear mocks and reset state between tests

### Accessibility Testing

- Test keyboard navigation
- Verify ARIA attributes
- Check screen reader compatibility
- Validate color contrast

## Future Enhancements

### Planned Additions

1. **Visual Regression Tests**: Screenshot comparison testing
2. **E2E Tests**: Playwright or Cypress integration
3. **Load Testing**: Artillery or K6 for backend
4. **Security Testing**: OWASP compliance tests
5. **Mobile Testing**: React Native component tests

### Monitoring Integration

- Test result tracking in monitoring dashboards
- Performance regression alerts
- Coverage trend analysis
- Flaky test detection

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Maintain coverage thresholds
3. Update test documentation
4. Follow existing patterns
5. Add performance benchmarks for critical paths

For questions or issues with testing, please refer to the test files for examples or create an issue in the repository.
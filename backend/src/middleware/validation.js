const { body, param, query, validationResult } = require('express-validator')

// Common validation rules
const commonValidations = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),

  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  name: body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  skillId: param('skillId')
    .isMongoId()
    .withMessage('Invalid skill ID'),

  userId: param('userId')
    .isMongoId()
    .withMessage('Invalid user ID'),

  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  page: query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
}

// Validation rule sets
const validationRules = {
  register: [
    commonValidations.name,
    commonValidations.email,
    commonValidations.password,
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match')
        }
        return true
      })
  ],

  login: [
    commonValidations.email,
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  forgotPassword: [
    commonValidations.email
  ],

  resetPassword: [
    commonValidations.password,
    body('token')
      .notEmpty()
      .withMessage('Reset token is required')
  ],

  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),

    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio must not exceed 500 characters'),

    body('location')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Location must not exceed 100 characters')
  ],

  createSkill: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Skill name must be between 2 and 100 characters'),

    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),

    body('category')
      .notEmpty()
      .withMessage('Category is required'),

    body('level')
      .isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])
      .withMessage('Invalid skill level'),

    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number')
  ],

  updateSkill: [
    commonValidations.skillId,
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Skill name must be between 2 and 100 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),

    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number')
  ],

  createBooking: [
    body('skillId')
      .isMongoId()
      .withMessage('Invalid skill ID'),

    body('teacherId')
      .isMongoId()
      .withMessage('Invalid teacher ID'),

    body('date')
      .isISO8601()
      .withMessage('Invalid date format'),

    body('duration')
      .isInt({ min: 30, max: 480 })
      .withMessage('Duration must be between 30 and 480 minutes'),

    body('message')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Message must not exceed 500 characters')
  ],

  createReview: [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),

    body('comment')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Comment must not exceed 500 characters'),

    body('bookingId')
      .isMongoId()
      .withMessage('Invalid booking ID')
  ],

  searchSkills: [
    query('q')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters'),

    query('category')
      .optional()
      .trim(),

    query('level')
      .optional()
      .isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])
      .withMessage('Invalid skill level'),

    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum price must be a positive number'),

    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Maximum price must be a positive number'),

    commonValidations.limit,
    commonValidations.page
  ]
}

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }))

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    })
  }

  next()
}

module.exports = {
  validationRules,
  handleValidationErrors
}
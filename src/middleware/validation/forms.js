import { body } from 'express-validator';

const spamWords = ['viagra', 'casino', 'lottery', 'winner', 'prize', 'click here', 'free money'];

const contactValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email')
        .normalizeEmail(),
    body('subject')
        .trim()
        .notEmpty().withMessage('Subject is required')
        .isLength({ max: 255 }).withMessage('Subject must be under 255 characters')
        .matches(/^[a-zA-Z0-9\s.,!?'-]+$/).withMessage('Subject contains invalid characters'),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ max: 2000 }).withMessage('Message must be under 2000 characters')
        .custom((value) => {
            const lowerValue = value.toLowerCase();
            const foundSpam = spamWords.some(word => lowerValue.includes(word));
            if (foundSpam) {
                throw new Error('Message contains prohibited content');
            }
            return true;
        }),
];

const registrationValidation = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ max: 100 }).withMessage('First name must be under 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ max: 100 }).withMessage('Last name must be under 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email')
        .isLength({ max: 255 }).withMessage('Email must be under 255 characters')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
];

const editValidation = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ max: 100 }).withMessage('First name must be under 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ max: 100 }).withMessage('Last name must be under 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email')
        .isLength({ max: 255 }).withMessage('Email must be under 255 characters')
        .normalizeEmail(),
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email')
        .isLength({ max: 255 }).withMessage('Email must be under 255 characters')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ max: 128 }).withMessage('Password must be under 128 characters'),
];

export { contactValidation, registrationValidation, editValidation, loginValidation };
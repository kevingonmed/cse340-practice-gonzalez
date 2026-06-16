import express from 'express';
import { facultyListPage, facultyDetailPage } from './controllers/faculty/faculty.js';
import { catalogPage, courseDetailPage } from './controllers/catalog/catalog.js';
import { showContactForm, processContactForm } from './controllers/forms/contact.js';
import {
    showRegistrationForm,
    processRegistration,
    showAccountList,
    showEditAccountForm,
    processEditAccount,
    processDeleteAccount
} from './controllers/forms/registration.js';
import { showLoginForm, processLogin, processLogout } from './controllers/forms/login.js';
import { requireLogin, requireRole } from './middleware/auth.js';
import { contactValidation, registrationValidation, editValidation, loginValidation } from './middleware/validation/forms.js';

const router = express.Router();

// Home routes
router.get('/', (req, res) => res.render('home', { title: 'Welcome Home' }));
router.get('/about', (req, res) => res.render('about', { title: 'About Me' }));
router.get('/products', (req, res) => res.render('products', { title: 'Our Products' }));
router.get('/student', (req, res) => {
    const student = {
        name: "Kevin Gonzalez",
        id: "792119701",
        email: "gon22043@byui.edu",
        address: "Shelbourne apartments"
    };
    res.render('student', { title: "Student Info", student });
});

// Faculty routes
router.get('/faculty', facultyListPage);
router.get('/faculty/:facultySlug', facultyDetailPage);

// Catalog routes
router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

// Contact routes
router.get('/contact', showContactForm);
router.post('/contact', contactValidation, processContactForm);

// Registration routes
router.get('/register', showRegistrationForm);
router.post('/register', registrationValidation, processRegistration);
router.get('/register/list', requireLogin, showAccountList);
router.get('/register/:id/edit', requireLogin, showEditAccountForm);
router.post('/register/:id/edit', requireLogin, editValidation, processEditAccount);
router.post('/register/:id/delete', requireLogin, processDeleteAccount);

// Login routes
router.get('/login', showLoginForm);
router.post('/login', loginValidation, processLogin);
router.get('/logout', processLogout);

// Dashboard (protected)
router.get('/dashboard', requireLogin, (req, res) => {
    res.render('forms/login/dashboard', {
        title: 'Dashboard',
        user: req.session.user
    });
});

export default router;
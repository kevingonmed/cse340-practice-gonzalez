import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { createUser, findUserByEmail, getUserById, getAllUsers, updateUser, deleteUser } from '../../models/forms/registration.js';

const showRegistrationForm = (req, res) => {
    res.render('forms/registration/form', {
        title: 'Register',
        errors: [],
        formData: {}
    });
};

const processRegistration = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('forms/registration/form', {
            title: 'Register',
            errors: errors.array(),
            formData: req.body
        });
    }

    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            req.flash('warning', 'An account with that email already exists.');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser({ firstName, lastName, email, password: hashedPassword });

        req.flash('success', 'Account created successfully! Please log in.');
        res.redirect('/login');
    } catch (error) {
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/register');
    }
};

const showAccountList = async (req, res) => {
    const users = await getAllUsers();
    res.render('forms/registration/list', {
        title: 'Account Management',
        users
    });
};

const showEditAccountForm = async (req, res, next) => {
    const targetId = parseInt(req.params.id);
    const currentUser = req.session.user;

    if (currentUser.roleName !== 'admin' && currentUser.id !== targetId) {
        req.flash('error', 'You do not have permission to edit that account.');
        return res.redirect('/register/list');
    }

    const targetUser = await getUserById(targetId);
    if (!targetUser) {
        const err = new Error('Account not found');
        err.status = 404;
        return next(err);
    }

    res.render('forms/registration/edit', {
        title: 'Edit Account',
        errors: [],
        formData: {
            firstName: targetUser.first_name,
            lastName: targetUser.last_name,
            email: targetUser.email
        },
        targetId
    });
};

const processEditAccount = async (req, res, next) => {
    const targetId = parseInt(req.params.id);
    const currentUser = req.session.user;

    if (currentUser.roleName !== 'admin' && currentUser.id !== targetId) {
        req.flash('error', 'You do not have permission to edit that account.');
        return res.redirect('/register/list');
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('forms/registration/edit', {
            title: 'Edit Account',
            errors: errors.array(),
            formData: req.body,
            targetId
        });
    }

    try {
        const { firstName, lastName, email } = req.body;
        await updateUser(targetId, { firstName, lastName, email });

        if (currentUser.id === targetId) {
            req.session.user.firstName = firstName;
            req.session.user.lastName = lastName;
            req.session.user.email = email;
        }

        req.flash('success', 'Account updated successfully.');
        res.redirect('/register/list');
    } catch (error) {
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect(`/register/${targetId}/edit`);
    }
};

const processDeleteAccount = async (req, res) => {
    const targetId = parseInt(req.params.id);
    const currentUser = req.session.user;

    if (currentUser.roleName !== 'admin' && currentUser.id !== targetId) {
        req.flash('error', 'You do not have permission to delete that account.');
        return res.redirect('/register/list');
    }

    try {
        await deleteUser(targetId);

        if (currentUser.id === targetId) {
            req.session.destroy(() => {
                res.redirect('/login');
            });
            return;
        }

        req.flash('success', 'Account deleted successfully.');
        res.redirect('/register/list');
    } catch (error) {
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/register/list');
    }
};

export {
    showRegistrationForm,
    processRegistration,
    showAccountList,
    showEditAccountForm,
    processEditAccount,
    processDeleteAccount
};
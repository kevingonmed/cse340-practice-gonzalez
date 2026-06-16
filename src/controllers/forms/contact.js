import { validationResult } from 'express-validator';
import { saveContactMessage } from '../../models/forms/contact.js';

const showContactForm = (req, res) => {
    res.render('forms/contact/form', {
        title: 'Contact Us',
        errors: [],
        formData: {}
    });
};

const processContactForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('forms/contact/form', {
            title: 'Contact Us',
            errors: errors.array(),
            formData: req.body
        });
    }

    try {
        await saveContactMessage(req.body);
        req.flash('success', 'Your message has been sent successfully!');
        res.redirect('/contact');
    } catch (error) {
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/contact');
    }
};

export { showContactForm, processContactForm };
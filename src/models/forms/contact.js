import db from '../db.js';

const saveContactMessage = async ({ name, email, subject, message }) => {
    const query = `
        INSERT INTO contact_messages (name, email, subject, message)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `;
    const result = await db.query(query, [name, email, subject, message]);
    return result.rows[0];
};

export { saveContactMessage };
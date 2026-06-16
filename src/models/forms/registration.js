import db from '../db.js';

const createUser = async ({ firstName, lastName, email, password }) => {
    const query = `
        INSERT INTO users (first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, first_name, last_name, email
    `;
    const result = await db.query(query, [firstName, lastName, email, password]);
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.*, r.name as role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.email = $1
    `;
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
};

const getUserById = async (id) => {
    const query = `
        SELECT u.*, r.name as role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
};

const getAllUsers = async () => {
    const query = `
        SELECT u.*, r.name as role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        ORDER BY u.last_name, u.first_name
    `;
    const result = await db.query(query);
    return result.rows;
};

const updateUser = async (id, { firstName, lastName, email }) => {
    const query = `
        UPDATE users
        SET first_name = $1, last_name = $2, email = $3
        WHERE id = $4
        RETURNING id, first_name, last_name, email
    `;
    const result = await db.query(query, [firstName, lastName, email, id]);
    return result.rows[0];
};

const deleteUser = async (id) => {
    const query = `DELETE FROM users WHERE id = $1`;
    await db.query(query, [id]);
    return true;
};

export { createUser, findUserByEmail, getUserById, getAllUsers, updateUser, deleteUser };
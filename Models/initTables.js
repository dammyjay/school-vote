const pool = require("./db");

async function initTables() {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS students (
            id SERIAL PRIMARY KEY,
            firstname VARCHAR(50),
            lastname VARCHAR(50),
            voting_id VARCHAR(20) UNIQUE,
            has_voted BOOLEAN DEFAULT false
        );
        `);

    await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100)
            );
        
        `);

    await pool.query(`
            CREATE TABLE IF NOT EXISTS candidates (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            image_url TEXT,
            category_id INTEGER REFERENCES categories(id),
            votes INTEGER DEFAULT 0,
            photo_url TEXT
            );
        
        `);

    await pool.query(`
            CREATE TABLE IF NOT EXISTS votes (
            id SERIAL PRIMARY KEY,
            student_id INTEGER REFERENCES students(id),
            candidate_id INTEGER REFERENCES candidates(id),
            category_id INTEGER REFERENCES categories(id)
            );
        
        `);

    await pool.query(`
            CREATE TABLE IF NOT EXISTS admin (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE,
            password VARCHAR(255)
            );

        
        `);

    await pool.query(`
  CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    voting_open BOOLEAN DEFAULT true
  );
`);

    await pool.query(`
        
        `);

    await pool.query(`
        
        `);

    await pool.query(`
        
        `);
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

module.exports = initTables;

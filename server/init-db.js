require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function init() {
  // Connect to default 'postgres' database first to create 'smarter' database
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Create database if not exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'smarter'");
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE smarter');
      console.log('Database "smarter" created');
    } else {
      console.log('Database "smarter" already exists');
    }
    await client.end();

    // Now connect to 'smarter' database to run schema
    const smarterClient = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'smarter'
    });

    await smarterClient.connect();
    console.log('Connected to "smarter" database');

    const schemaSql = fs.readFileSync(path.join(__dirname, 'src', 'db', 'schema.sql'), 'utf8');
    await smarterClient.query(schemaSql);
    console.log('Schema applied successfully');

    // Optional: Seed data if seed.sql exists
    const seedPath = path.join(__dirname, 'src', 'db', 'seed.sql');
    if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await smarterClient.query(seedSql);
        console.log('Seed data applied successfully');
    }

    await smarterClient.end();
    console.log('Database initialization complete');
  } catch (err) {
    console.error('Initialization failed:', err);
    process.exit(1);
  }
}

init();

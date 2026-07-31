const fs = require('fs');
const path = require('path');
const db = require('./index');

async function seedDatabase() {
    console.log('Starting database seeding...');

    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const seedPath = path.join(__dirname, 'seed.sql');

        console.log('Reading schema.sql...');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Reading seed.sql...');
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        console.log('Executing schema.sql...');
        await db.query(schemaSql);

        console.log('Executing seed.sql...');
        await db.query(seedSql);

        console.log('Database seeded successfully with 39 hospitals!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await db.end();
        process.exit();
    }
}

seedDatabase();

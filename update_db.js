require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true // Enable multiple statements
});

// Read the schema file
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Execute the schema
db.connect((err) => {
    if (err) {
        console.error('❌ Database Connection Failed:', err);
        process.exit(1);
    }
    
    console.log('✅ Connected to MySQL Database');
    
    db.query(schema, (err, results) => {
        if (err) {
            console.error('❌ Error updating database schema:', err);
            process.exit(1);
        }
        
        console.log('✅ Database schema updated successfully!');
        db.end();
    });
}); 
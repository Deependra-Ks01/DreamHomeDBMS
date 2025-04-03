require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5000', 'http://127.0.0.1:5000'],  // Allow frontend origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Check MySQL Connection
db.connect((err) => {
    if (err) {
        console.error('Database Connection Failed:', err);
    } else {
        console.log('✅ Connected to MySQL Database');
    }
});

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to the DreamHome API!");
});

// 🔹 1. Get All Branches
app.get('/branches', (req, res) => {
    const query = 'SELECT branch_id, branch_name, location FROM Branch';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching branches:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});

// 🔹 2. Add a New Branch
app.post('/branches', (req, res) => {
    const { branch_name, location } = req.body;
    const query = 'INSERT INTO Branch (branch_name, location) VALUES (?, ?)';
    db.query(query, [branch_name, location], (err, result) => {
        if (err) {
            console.error('Error adding branch:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Branch added successfully', branchId: result.insertId });
        }
    });
});

// 🔹 3. Get All Staff Members
app.get('/staff', (req, res) => {
    const query = `
        SELECT s.staff_id, s.name, s.position, s.contact, b.branch_name, b.location 
        FROM Staff s 
        LEFT JOIN Branch b ON s.branch_id = b.branch_id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching staff:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});

// 🔹 4. Add a New Staff Member
app.post('/staff', (req, res) => {
    const { name, position, branch_id, contact } = req.body;
    const query = 'INSERT INTO Staff (name, position, branch_id, contact) VALUES (?, ?, ?, ?)';
    db.query(query, [name, position, branch_id, contact], (err, result) => {
        if (err) {
            console.error('Error adding staff:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Staff added successfully', staffId: result.insertId });
        }
    });
});

// 🔹 5. Get All Properties
app.get('/properties', (req, res) => {
    const query = 'SELECT * FROM Property';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching properties:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});

// 🔹 6. ✅ FIXED: Get a Single Property by propertyNo
app.get('/properties/:propertyNo', (req, res) => {
    const { propertyNo } = req.params;
    const query = 'SELECT * FROM Property WHERE propertyNo = ?';

    db.query(query, [propertyNo], (err, results) => {
        if (err) {
            console.error('Error fetching property:', err);
            res.status(500).json({ error: 'Database error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Property not found' });
        } else {
            res.json(results[0]); // Return single property
        }
    });
});

// 🔹 7. Add a New Property
app.post('/properties', (req, res) => {
    const { propertyNo, street, city, postcode, type, rooms, rent, ownerNo, staffNo, branchNo } = req.body;
    const query = 'INSERT INTO Property (propertyNo, street, city, postcode, type, rooms, rent, ownerNo, staffNo, branchNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [propertyNo, street, city, postcode, type, rooms, rent, ownerNo, staffNo, branchNo], (err, result) => {
        if (err) {
            console.error('Error adding property:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Property added successfully', propertyId: result.insertId });
        }
    });
});

// 🔹 8. Get All Clients
app.get('/clients', (req, res) => {
    const query = 'SELECT * FROM Client';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching clients:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});

// 🔹 9. Add a New Client
app.post('/clients', (req, res) => {
    const { clientNumber, name, branchNumber, branchAddress, registeredBy, dateRegistered, propertyType, maxRent } = req.body;
    
    const query = `
        INSERT INTO Client (
            client_number, 
            name, 
            branch_number, 
            branch_address, 
            registered_by, 
            date_registered, 
            property_type, 
            max_rent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [
        clientNumber, 
        name, 
        branchNumber, 
        branchAddress, 
        registeredBy, 
        dateRegistered, 
        propertyType, 
        maxRent
    ], (err, result) => {
        if (err) {
            console.error('Error registering client:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ 
                message: 'Client registered successfully', 
                clientId: result.insertId 
            });
        }
    });
});

// 🔹 10. Delete a Property
app.delete('/properties/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Property WHERE propertyNo = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting property:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Property deleted successfully' });
        }
    });
});

// 🔹 11. Delete a Staff Member
app.delete('/staff/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Staff WHERE staff_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting staff:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Staff deleted successfully' });
        }
    });
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token.' });
        }
        req.user = user;
        next();
    });
};

// User Registration
app.post('/register', async (req, res) => {
    const { user_id, password, role, staff_number } = req.body;

    try {
        // Check if user already exists
        const checkUserQuery = 'SELECT * FROM Users WHERE user_id = ?';
        db.query(checkUserQuery, [user_id], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user
            const insertQuery = 'INSERT INTO Users (user_id, password, role, staff_number) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [user_id, hashedPassword, role, staff_number], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error creating user' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { user_id, password } = req.body;

    try {
        // Find user
        const query = 'SELECT * FROM Users WHERE user_id = ?';
        db.query(query, [user_id], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = results[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { user_id: user.user_id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    user_id: user.user_id,
                    role: user.role,
                    staff_number: user.staff_number
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Protected route example
app.get('/profile', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// Staff Registration Endpoint
app.post('/api/staff/register', (req, res) => {
    const {
        staff_number,
        name,
        sex,
        dob,
        position,
        salary,
        branch_number,
        branch_address,
        phone,
        supervisor,
        manager_start_date,
        manager_bonus
    } = req.body;

    // Validate required fields
    if (!staff_number || !name || !position) {
        return res.status(400).json({ error: 'Staff number, name, and position are required' });
    }

    const query = `
        INSERT INTO staff (
            staff_number,
            name,
            sex,
            dob,
            position,
            salary,
            branch_number,
            branch_address,
            phone,
            supervisor,
            manager_start_date,
            manager_bonus
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            staff_number,
            name,
            sex,
            dob,
            position,
            salary,
            branch_number,
            branch_address,
            phone,
            supervisor,
            manager_start_date,
            manager_bonus
        ],
        (err, result) => {
            if (err) {
                console.error('Error registering staff:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Staff number already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            
            res.status(201).json({
                message: 'Staff registered successfully',
                staffId: result.insertId
            });
        }
    );
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
});

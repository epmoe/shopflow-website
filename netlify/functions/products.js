
const mysql = require('mysql2/promise');
const { X509Certificate } = require('node:crypto');

exports.handler = async (event, context) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    let connection;

    try {
        // Check environment variables
        const required = [
            'DB_HOST',
            'DB_PORT',
            'DB_USER',
            'DB_PASSWORD',
            'DB_NAME',
            'DB_CA_CERT'
        ];

        for (const key of required) {
            console.log(key + ' present:', !!process.env[key]);

            if (!process.env[key]) {
                throw new Error('Missing environment variable: ' + key);
            }
        }

        // Inspect certificate BEFORE connecting
        const ca = process.env.DB_CA_CERT
            .replace(/\\n/g, '\n')
            .trim();

        const cert = new X509Certificate(ca);

        console.log('Certificate length:', ca.length);
        console.log('Certificate subject:', cert.subject);
        console.log('Certificate issuer:', cert.issuer);
        console.log('Certificate expiration:', cert.validTo);
        console.log('Certificate fingerprint:', cert.fingerprint256);

        // Connect to database
        console.log('Attempting database connection...');

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {
                ca: ca,
                rejectUnauthorized: true
            }
        });

        console.log('Database connection successful');

        const [rows] = await connection.execute(
            'SELECT product_id, product_name, category, price, stock_quantity FROM products WHERE status = ?',
            ['Active']
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(rows)
        };

    } catch (error) {
        console.error('Database error:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Database connection failed'
            })
        };

    } finally {
        if (connection) await connection.end();
    }
};

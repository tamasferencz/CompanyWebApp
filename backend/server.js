const express = require('express');
const dotenv = require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const PORT = process.env.PORT || 3000

const app = express();
app.use(express.json());

//MYSQL Database Connection
const sequelize = require('./config/database');
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
        // Sync all defined models to the DB
        return sequelize.sync({ alter: true });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


// Swagger config
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Company API",
            version: "1.0.0",
            description: "API documentation for the Company Express backend",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    swaggerOptions: {
        operationsSorter: 'alpha',  // Sort operations alphabetically by operationId
        docExpansion: 'list',       // Show operations list expanded
        filter: true,               // Enable search filter
        showRequestHeaders: false,  // Hide request headers section
        tagsSorter: 'alpha'
    },
    apis: ["./routes/*.js", "./controllers/*.js"], // path to your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Routes
const companyRouter = require('./routes/companyRouter');
app.use('/api', companyRouter);

//Port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
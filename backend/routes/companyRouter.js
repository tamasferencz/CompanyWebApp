const express = require('express');
const router = express.Router();

const {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
} = require('../controllers/companyController');

const {
    createCompanyAddresses,
    getCompanyAddresses,
    updateCompanyAddress,
    deleteCompanyAddress
} = require('../controllers/companyAddressController');

// Create a new company
router.post('/companies', createCompany);
// Create a new address for a company
router.post('/companies/:id/addresses', createCompanyAddresses);

// Get all companies
router.get('/companies', getCompanies);

// Get a single company by ID
router.get('/companies/:id', getCompanyById);
// Get all addresses for a company by ID
router.get('/companies/:id/addresses', getCompanyAddresses);

// Update a company by ID
router.put('/companies/:id', updateCompany);
// Update a company address by address ID
router.put('/companies/:id/addresses/:addressId', updateCompanyAddress);

// Delete a company by ID
router.delete('/companies/:id', deleteCompany);
// Delete a company address by address ID
router.delete('/companies/:id/addresses/:addressId', deleteCompanyAddress);

module.exports = router;
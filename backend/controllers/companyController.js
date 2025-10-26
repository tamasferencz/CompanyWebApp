const CompanyAddress = require('../models/companyAddressModel');
const Company = require('../models/companyModel');

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - name
 *         - vatNumber
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the company
 *         name:
 *           type: string
 *           description: The company name
 *         vatNumber:
 *           type: string
 *           description: The company VAT number
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CompanyAddress'
 *           description: List of company addresses
 *       example:
 *         id: 1
 *         name: "Acme Corporation"
 *         vatNumber: "US123456789"
 *         addresses: [
 *           {
 *             id: 1,
 *             companyId: 1,
 *             street: "123 Main Street",
 *             city: "New York",
 *             state: "NY",
 *             zipCode: "10001",
 *             country: "USA"
 *           }
 *         ]
 *     CompanyInput:
 *       type: object
 *       required:
 *         - name
 *         - vatNumber
 *       properties:
 *         name:
 *           type: string
 *           description: The company name
 *         vatNumber:
 *           type: string
 *           description: The company VAT number
 *         address:
 *           type: object
 *           required:
 *             - street
 *             - city
 *             - country
 *           properties:
 *             street:
 *               type: string
 *               description: Street address (required if address is provided)
 *             city:
 *               type: string
 *               description: City name (required if address is provided)
 *             state:
 *               type: string
 *               description: State or province (optional)
 *             zipCode:
 *               type: string
 *               description: ZIP or postal code (optional)
 *             country:
 *               type: string
 *               description: Country name (required if address is provided)
 *           description: Optional address to create with the company. If provided, street, city, and country are required.
 *       example:
 *         name: "Acme Corporation"
 *         vatNumber: "US123456789"
 *         address:
 *           street: "123 Main Street"
 *           city: "New York"
 *           state: "NY"
 *           zipCode: "10001"
 *           country: "USA"
 *     CompanyAddress:
 *       type: object
 *       required:
 *         - companyId
 *         - street
 *         - city
 *         - country
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the address
 *         companyId:
 *           type: integer
 *           description: The ID of the company this address belongs to
 *         street:
 *           type: string
 *           description: Street address
 *         city:
 *           type: string
 *           description: City name
 *         state:
 *           type: string
 *           description: State or province
 *         zipCode:
 *           type: string
 *           description: ZIP or postal code
 *         country:
 *           type: string
 *           description: Country name
 *       example:
 *         id: 1
 *         companyId: 1
 *         street: "123 Main Street"
 *         city: "New York"
 *         state: "NY"
 *         zipCode: "10001"
 *         country: "USA"
 *     CompanyAddressInput:
 *       type: object
 *       required:
 *         - street
 *         - city
 *         - country
 *       properties:
 *         street:
 *           type: string
 *           description: Street address
 *         city:
 *           type: string
 *           description: City name
 *         state:
 *           type: string
 *           description: State or province
 *         zipCode:
 *           type: string
 *           description: ZIP or postal code
 *         country:
 *           type: string
 *           description: Country name
 *       example:
 *         street: "123 Main Street"
 *         city: "New York"
 *         state: "NY"
 *         zipCode: "10001"
 *         country: "USA"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *       example:
 *         error: "Failed to create company"
 */

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyInput'
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const createCompany = async (req, res) => {
    try {
        const { name, vatNumber, address } = req.body;

        // Validate required company fields
        if (!name || !vatNumber) {
            return res.status(400).json({ error: 'Name and VAT number are required' });
        }

        const newCompany = await Company.create({ name, vatNumber });

        if (address) {
            const newAddress = await CompanyAddress.create({
                street: address.street,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                country: address.country,
                companyId: newCompany.id
            });
            newCompany.dataValues.addresses = [newAddress];
        }

        res.status(201).json(newCompany);
    } catch (error) {
        console.error('Create company error:', error);
        res.status(500).json({ error: 'Failed to create company: ' + error.message });
    }
};

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: List of all companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const getCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve companies' });
    }
};

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findByPk(id, {
            include: [{ model: CompanyAddress, as: 'addresses' }]
        });

        if (company) {
            res.status(200).json(company);
        } else {
            res.status(404).json({ error: 'Company not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve company' });
    }
};

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Update a company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyInput'
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, vatNumber } = req.body;
        const [updated] = await Company.update({ name, vatNumber }, { where: { id } });
        if (updated) {
            const updatedCompany = await Company.findByPk(id);
            res.status(200).json(updatedCompany);
        } else {
            res.status(404).json({ error: 'Company not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update company' });
    }
};

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Company ID
 *     responses:
 *       204:
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Company.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Company not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete company' });
    }
};

module.exports = {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
};
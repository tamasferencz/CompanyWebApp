const CompanyAddress = require('../models/companyAddressModel');
const Company = require('../models/companyModel');

/**
 * @swagger
 * /api/companies/{id}/addresses:
 *   post:
 *     summary: Create a new address for a company
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
 *             $ref: '#/components/schemas/CompanyAddressInput'
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyAddress'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const createCompanyAddresses = async (req, res) => {
    try {
        const { id } = req.params;
        const { street, city, state, zipCode, country } = req.body;
        const newAddress = await CompanyAddress.create({
            companyId: id,
            street,
            city,
            state,
            zipCode,
            country
        });
        res.status(201).json(newAddress);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create company address: ' + error.message });
    }
};


/**
 * @swagger
 * /api/companies/{id}/addresses:
 *   get:
 *     summary: Get all addresses for a specific company
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
 *         description: List of company addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CompanyAddress'
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
const getCompanyAddresses = async (req, res) => {
    try {
        const { id } = req.params;
        const companyAddresses = await CompanyAddress.findAll({ where: { companyId: id } });
        if (companyAddresses) {
            res.status(200).json(companyAddresses);
        } else {
            res.status(404).json({ error: 'Company not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve company' });
    }
};

/**
 * @swagger
 * /api/companies/{id}/addresses/{addressId}:
 *   put:
 *     summary: Update a company address
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Company ID
 *       - in: path
 *         name: addressId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyAddressInput'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyAddress'
 *       404:
 *         description: Company address not found
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
const updateCompanyAddress = async (req, res) => {
    try {
        const { id, addressId } = req.params;
        const { street, city, state, zipCode, country } = req.body;
        const [updated] = await CompanyAddress.update(
            { street, city, state, zipCode, country },
            { where: { id: addressId, companyId: id } }
        );
        if (updated) {
            const updatedAddress = await CompanyAddress.findByPk(addressId);
            res.status(200).json(updatedAddress);
        } else {
            res.status(404).json({ error: 'Company address not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update company address' });
    }
};

/**
 * @swagger
 * /api/companies/{id}/addresses/{addressId}:
 *   delete:
 *     summary: Delete a company address
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Company ID
 *       - in: path
 *         name: addressId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Address ID
 *     responses:
 *       204:
 *         description: Address deleted successfully
 *       404:
 *         description: Company address not found
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
const deleteCompanyAddress = async (req, res) => {
    try {
        const { id, addressId } = req.params;
        const deleted = await CompanyAddress.destroy({ where: { id: addressId, companyId: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Company address not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete company address' });
    }
};

module.exports = {
    createCompanyAddresses,
    getCompanyAddresses,
    updateCompanyAddress,
    deleteCompanyAddress
};
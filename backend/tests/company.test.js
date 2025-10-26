const request = require('supertest');
const app = require('../server');

// Mock the database connection to avoid real database operations during testing
jest.mock('../config/database', () => ({
    authenticate: jest.fn().mockResolvedValue(),
    sync: jest.fn().mockResolvedValue()
}));

// Mock the models
jest.mock('../models/companyModel', () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
}));

jest.mock('../models/companyAddressModel', () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
}));

const Company = require('../models/companyModel');
const CompanyAddress = require('../models/companyAddressModel');

describe('Company API Endpoints', () => {

    // Clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/companies', () => {
        test('should create a new company successfully', async () => {
            const mockCompany = {
                id: 1,
                name: 'Test Company',
                vatNumber: 'US123456789'
            };

            Company.create.mockResolvedValue(mockCompany);

            const response = await request(app)
                .post('/api/companies')
                .send({
                    name: 'Test Company',
                    vatNumber: 'US123456789'
                })
                .expect(201);

            expect(response.body).toEqual(mockCompany);
            expect(Company.create).toHaveBeenCalledWith({
                name: 'Test Company',
                vatNumber: 'US123456789'
            });
        });

        test('should create company with address', async () => {
            const mockCompany = {
                id: 1,
                name: 'Test Company',
                vatNumber: 'US123456789',
                dataValues: {}
            };

            const mockAddress = {
                id: 1,
                companyId: 1,
                street: '123 Test St',
                city: 'Test City',
                country: 'USA'
            };

            Company.create.mockResolvedValue(mockCompany);
            CompanyAddress.create.mockResolvedValue(mockAddress);

            const response = await request(app)
                .post('/api/companies')
                .send({
                    name: 'Test Company',
                    vatNumber: 'US123456789',
                    address: {
                        street: '123 Test St',
                        city: 'Test City',
                        state: 'TS',
                        zipCode: '12345',
                        country: 'USA'
                    }
                })
                .expect(201);

            expect(Company.create).toHaveBeenCalledWith({
                name: 'Test Company',
                vatNumber: 'US123456789'
            });

            expect(CompanyAddress.create).toHaveBeenCalledWith({
                street: '123 Test St',
                city: 'Test City',
                state: 'TS',
                zipCode: '12345',
                country: 'USA',
                companyId: 1
            });
        });

        test('should return 400 for missing required fields', async () => {
            const response = await request(app)
                .post('/api/companies')
                .send({
                    name: 'Test Company'
                    // Missing vatNumber
                })
                .expect(400);

            expect(response.body.error).toBe('Name and VAT number are required');
        });
    });

    describe('GET /api/companies', () => {
        test('should get all companies', async () => {
            const mockCompanies = [
                { id: 1, name: 'Company 1', vatNumber: 'US111' },
                { id: 2, name: 'Company 2', vatNumber: 'US222' }
            ];

            Company.findAll.mockResolvedValue(mockCompanies);

            const response = await request(app)
                .get('/api/companies')
                .expect(200);

            expect(response.body).toEqual(mockCompanies);
            expect(Company.findAll).toHaveBeenCalled();
        });

        test('should handle database errors', async () => {
            Company.findAll.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/companies')
                .expect(500);

            expect(response.body.error).toBe('Failed to retrieve companies');
        });
    });

    describe('GET /api/companies/:id', () => {
        test('should get company by id', async () => {
            const mockCompany = {
                id: 1,
                name: 'Test Company',
                vatNumber: 'US123456789'
            };

            Company.findByPk.mockResolvedValue(mockCompany);

            const response = await request(app)
                .get('/api/companies/1')
                .expect(200);

            expect(response.body).toEqual(mockCompany);
            expect(Company.findByPk).toHaveBeenCalledWith('1', {
                include: [{ model: CompanyAddress, as: 'addresses' }]
            });
        });

        test('should return 404 for non-existent company', async () => {
            Company.findByPk.mockResolvedValue(null);

            const response = await request(app)
                .get('/api/companies/999')
                .expect(404);

            expect(response.body.error).toBe('Company not found');
        });
    });

    describe('PUT /api/companies/:id', () => {
        test('should update company successfully', async () => {
            const mockUpdatedCompany = {
                id: 1,
                name: 'Updated Company',
                vatNumber: 'US987654321'
            };

            Company.update.mockResolvedValue([1]); // Sequelize returns array with number of affected rows
            Company.findByPk.mockResolvedValue(mockUpdatedCompany);

            const response = await request(app)
                .put('/api/companies/1')
                .send({
                    name: 'Updated Company',
                    vatNumber: 'US987654321'
                })
                .expect(200);

            expect(response.body).toEqual(mockUpdatedCompany);
            expect(Company.update).toHaveBeenCalledWith(
                { name: 'Updated Company', vatNumber: 'US987654321' },
                { where: { id: '1' } }
            );
        });

        test('should return 404 for non-existent company', async () => {
            Company.update.mockResolvedValue([0]); // No rows affected

            const response = await request(app)
                .put('/api/companies/999')
                .send({
                    name: 'Updated Company',
                    vatNumber: 'US987654321'
                })
                .expect(404);

            expect(response.body.error).toBe('Company not found');
        });
    });

    describe('DELETE /api/companies/:id', () => {
        test('should delete company successfully', async () => {
            Company.destroy.mockResolvedValue(1); // Number of deleted rows

            const response = await request(app)
                .delete('/api/companies/1')
                .expect(204);

            expect(Company.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
        });

        test('should return 404 for non-existent company', async () => {
            Company.destroy.mockResolvedValue(0); // No rows deleted

            const response = await request(app)
                .delete('/api/companies/999')
                .expect(404);

            expect(response.body.error).toBe('Company not found');
        });
    });
});

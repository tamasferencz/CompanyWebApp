const request = require('supertest');
const app = require('../server');

// Mock the database and models
jest.mock('../config/database', () => ({
    authenticate: jest.fn().mockResolvedValue(),
    sync: jest.fn().mockResolvedValue()
}));

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

const CompanyAddress = require('../models/companyAddressModel');

describe('Company Address API Endpoints', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/companies/:id/addresses', () => {
        test('should create a new address for company', async () => {
            const mockAddress = {
                id: 1,
                companyId: 1,
                street: '123 Test Street',
                city: 'Test City',
                state: 'TS',
                zipCode: '12345',
                country: 'USA'
            };

            CompanyAddress.create.mockResolvedValue(mockAddress);

            const response = await request(app)
                .post('/api/companies/1/addresses')
                .send({
                    street: '123 Test Street',
                    city: 'Test City',
                    state: 'TS',
                    zipCode: '12345',
                    country: 'USA'
                })
                .expect(201);

            expect(response.body).toEqual(mockAddress);
            expect(CompanyAddress.create).toHaveBeenCalledWith({
                companyId: '1',
                street: '123 Test Street',
                city: 'Test City',
                state: 'TS',
                zipCode: '12345',
                country: 'USA'
            });
        });

        test('should handle creation errors', async () => {
            CompanyAddress.create.mockRejectedValue(new Error('Validation error'));

            const response = await request(app)
                .post('/api/companies/1/addresses')
                .send({
                    street: '123 Test Street',
                    city: 'Test City',
                    country: 'USA'
                })
                .expect(400);

            expect(response.body.error).toContain('Failed to create company address');
        });
    });

    describe('GET /api/companies/:id/addresses', () => {
        test('should get all addresses for a company', async () => {
            const mockAddresses = [
                {
                    id: 1,
                    companyId: 1,
                    street: '123 Test Street',
                    city: 'Test City',
                    country: 'USA'
                },
                {
                    id: 2,
                    companyId: 1,
                    street: '456 Another Street',
                    city: 'Another City',
                    country: 'USA'
                }
            ];

            CompanyAddress.findAll.mockResolvedValue(mockAddresses);

            const response = await request(app)
                .get('/api/companies/1/addresses')
                .expect(200);

            expect(response.body).toEqual(mockAddresses);
            expect(CompanyAddress.findAll).toHaveBeenCalledWith({ where: { companyId: '1' } });
        });
    });

    describe('PUT /api/companies/:id/addresses/:addressId', () => {
        test('should update company address successfully', async () => {
            const mockUpdatedAddress = {
                id: 1,
                companyId: 1,
                street: 'Updated Street',
                city: 'Updated City',
                country: 'USA'
            };

            CompanyAddress.update.mockResolvedValue([1]); // Number of affected rows
            CompanyAddress.findByPk.mockResolvedValue(mockUpdatedAddress);

            const response = await request(app)
                .put('/api/companies/1/addresses/1')
                .send({
                    street: 'Updated Street',
                    city: 'Updated City',
                    country: 'USA'
                })
                .expect(200);

            expect(response.body).toEqual(mockUpdatedAddress);
            expect(CompanyAddress.update).toHaveBeenCalledWith(
                {
                    street: 'Updated Street',
                    city: 'Updated City',
                    state: undefined,
                    zipCode: undefined,
                    country: 'USA'
                },
                { where: { id: '1', companyId: '1' } }
            );
        });

        test('should return 404 for non-existent address', async () => {
            CompanyAddress.update.mockResolvedValue([0]); // No rows affected

            const response = await request(app)
                .put('/api/companies/1/addresses/999')
                .send({
                    street: 'Updated Street',
                    city: 'Updated City',
                    country: 'USA'
                })
                .expect(404);

            expect(response.body.error).toBe('Company address not found');
        });
    });

    describe('DELETE /api/companies/:id/addresses/:addressId', () => {
        test('should delete company address successfully', async () => {
            CompanyAddress.destroy.mockResolvedValue(1); // Number of deleted rows

            await request(app)
                .delete('/api/companies/1/addresses/1')
                .expect(204);

            expect(CompanyAddress.destroy).toHaveBeenCalledWith({
                where: { id: '1', companyId: '1' }
            });
        });

        test('should return 404 for non-existent address', async () => {
            CompanyAddress.destroy.mockResolvedValue(0); // No rows deleted

            const response = await request(app)
                .delete('/api/companies/1/addresses/999')
                .expect(404);

            expect(response.body.error).toBe('Company address not found');
        });
    });
});

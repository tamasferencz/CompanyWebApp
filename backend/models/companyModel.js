const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CompanyAddress = require('./companyAddressModel');

const Company = sequelize.define(
    'Company',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // Model attributes are defined here
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 256,
            unique: true,
        },
        vatNumber: {
            type: DataTypes.STRING,
            length: 32,
            // allowNull defaults to true
        },
    },
    {
        // Other model options go here
    },
);

Company.hasMany(CompanyAddress, { foreignKey: 'companyId', as: 'addresses' });
CompanyAddress.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// `sequelize.define` also returns the model
console.log(Company === sequelize.models.Company); // true

module.exports = Company;
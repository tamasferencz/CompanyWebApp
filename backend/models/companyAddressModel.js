const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompanyAddress = sequelize.define(
    'CompanyAddress',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zipCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        // Other model options go here
    },
);

// `sequelize.define` also returns the model
console.log(CompanyAddress === sequelize.models.CompanyAddress); // true

module.exports = CompanyAddress;

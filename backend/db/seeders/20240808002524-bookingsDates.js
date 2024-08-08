'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models');

const bookings = [
  {
    spotId: 1,
    userId: 1,
    startDate: new Date('2024-08-21'),
    endDate: new Date('2024-08-22')
  },
  {
    spotId: 2,
    userId: 2,
    startDate: new Date('2023-08-10'),
    endDate: new Date('2023-08-15')
  },
  {
    spotId: 3,
    userId: 3,
    startDate: new Date('2024-08-20'),
    endDate: new Date('2024-08-25')
  },
  {
    spotId: 5,
    userId: 2,
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-09-05')
  },
  {
    spotId: 5,
    userId: 3,
    startDate: new Date('2030-11-22'),
    endDate: new Date('2030-11-26')
  }
]
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    try {
    await Booking.bulkCreate(bookings, {validate: true});
    } catch(err) {
    console.error(err);
    throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await Booking.destroy({ where: {}, truncate: true });

  }
};

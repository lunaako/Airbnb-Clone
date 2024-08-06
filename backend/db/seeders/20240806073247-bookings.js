'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models');

const bookings = [
  {
    spotId: 1,
    userId: 1,
    startDate: '2024-08-01',
    endDate: '2024-08-07'
  },
  {
    spotId: 2,
    userId: 2,
    startDate: '2024-08-10',
    endDate: '2024-08-15'
  },
  {
    spotId: 3,
    userId: 3,
    startDate: '2024-08-20',
    endDate: '2024-08-25'
  },
  {
    spotId: 4,
    userId: 1,
    startDate: '2024-09-01',
    endDate: '2024-09-05'
  },
  {
    spotId: 5,
    userId: 2,
    startDate: '2024-09-10',
    endDate: '2024-09-15'
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
    await Booking.bulkCreate(bookings);
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

'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');
const reviews = [
  {
    "userId": 3,
    "spotId": 1,
    "review": "I dont't like it :(",
    "stars": 1
  },
  {
    "userId": 2,
    "spotId": 1,
    "review": "My dog dislike it",
    "stars": 1
  },
  {
    "userId": 1,
    "spotId": 3,
    "review": "Not what I expected, quite disappointing.",
    "stars": 2
  },
]

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Review.bulkCreate(reviews, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await Review.destroy({ where: {}, truncate: true });
  }
};

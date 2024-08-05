'use strict';

/** @type {import('sequelize-cli').Migration} */

const {Review} = require('../models');
const reviews = [
  {
    "userId": 1,
    "spotId": 1,
    "review": "This was an awesome spot!",
    "stars": 5
  },
  {
    "userId": 2,
    "spotId": 2,
    "review": "Great experience, highly recommend.",
    "stars": 4
  },
  {
    "userId": 3,
    "spotId": 3,
    "review": "It was decent, but could be better.",
    "stars": 3
  },
  {
    "userId": 1,
    "spotId": 4,
    "review": "Not what I expected, quite disappointing.",
    "stars": 2
  },
  {
    "userId": 2,
    "spotId": 5,
    "review": "Terrible experience, will not return.",
    "stars": 1
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
    await Review.bulkCreate(reviews, {validate: true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await Review.destroy({where: {}, truncate: true});
  }
};

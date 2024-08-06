'use strict';

const { ReviewImage } = require('../models');

/** @type {import('sequelize-cli').Migration} */

const reviewImages = [
  {
    reviewId: 1,
    url: 'https://example.com/review1_image1.jpg',
  },
  {
    reviewId: 1,
    url: 'https://example.com/review1_image2.jpg',
  },
  {
    reviewId: 2,
    url: 'https://example.com/review2_image1.jpg',
  },
  {
    reviewId: 3,
    url: 'https://example.com/review3_image1.jpg',
  },
  {
    reviewId: 4,
    url: 'https://example.com/review4_image1.jpg',
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
    await ReviewImage.bulkCreate(reviewImages);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await ReviewImage.destroy({ where: {}, truncate: true });
  }
};

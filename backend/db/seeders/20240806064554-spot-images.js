'use strict';
/** @type {import('sequelize-cli').Migration} */


const { SpotImage } = require('../models');
const spotImages = [
  {
    spotId: 1,
    url: 'https://example1.com/image1.jpg',
    preview: true,
  },

  {
    spotId: 2,
    url: 'https://example2.com/image2.jpg',
    preview: true,
  },

  {
    spotId: 3,
    url: 'https://example3.com/image3.jpg',
    preview: true,
  },

  {
    spotId: 4,
    url: 'https://example4.com/image4.jpg',
    preview: true,
  },

  {
    spotId: 5,
    url: 'https://example5.com/image5.jpg',
    preview: true,
  },
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
    await SpotImage.bulkCreate(spotImages)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await SpotImage.destroy({where: {}, truncate: true});
  }
};

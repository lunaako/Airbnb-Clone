'use strict';
/** @type {import('sequelize-cli').Migration} */


const { SpotImage } = require('../models');
const spotImages = [
  {
    spotId: 1,
    url: 'https://www.tennessean.com/gcdn/presto/2022/11/08/PNAS/96d8c217-8161-427a-849f-d37284d3cb1d-Suites_Side.jpg?width=1320&height=744&fit=crop&format=pjpg&auto=webp',
    preview: true,
  },

  {
    spotId: 2,
    url: 'https://www.lvdoghotel.com/wp-content/uploads/2023/05/6810-W-Sahara-Ave-41-scaled.jpg',
    preview: true,
  },

  {
    spotId: 3,
    url: 'https://d367pvje6v6lu5.cloudfront.net/pictures/images/000/029/301/big_slider_pic/1.jpg?1629799514',
    preview: true,
  },

  {
    spotId: 4,
    url: 'https://www.truckeetahoepetlodge.com/wp-content/uploads/2020/09/dog-boarding-image-4.jpg.webp',
    preview: true,
  },

  {
    spotId: 5,
    url: 'https://static.bangkokpost.com/media/content/dcx/2022/01/21/4206407.jpg',
    preview: true,
  },

  {
    spotId: 1,
    url: 'https://www.veryimportantpaws.com/wp-content/uploads/2023/11/Overview-of-Modern-Dog-Hotels.webp',
    preview: false,
  },

  {
    spotId: 1,
    url: 'https://static01.nyt.com/images/2024/03/17/magazine/17mag-dog/17mag-dog-superJumbo.jpg?quality=75&auto=webp',
    preview: false,
  },

  {
    spotId: 1,
    url: 'https://www.wagatlanta.com/uploads/5/0/7/7/50777777/6614e6ce-7586-4e72-aee0-9634e03746bb-1-201-a_orig.jpeg',
    preview: false,
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

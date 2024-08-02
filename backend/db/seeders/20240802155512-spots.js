'use strict';

const { Spot } = require('../models');
const spots = [
  {
  address: "123 Main St",
  city: "Seattle",
  state: "WA",
  country: "USA",
  lat: 47.6097,
  lng: -122.3331,
  name: "Cozy Apartment in Downtown",
  description: "A cozy apartment located in the heart of downtown Seattle. Close to all major attractions and public transportation.",
  price: 150.00,
  ownerId: 1
},

{
  address: "456 Elm St",
  city: "San Francisco",
  state: "CA",
  country: "USA",
  lat: 37.7749,
  lng: -122.4194,
  name: "Beautiful Victorian Home",
  description: "Experience the charm of San Francisco in this beautiful Victorian home with modern amenities.",
  price: 250.00,
  ownerId: 2
},
{
  address: "789 Oak St",
  city: "Portland",
  state: "OR",
  country: "USA",
  lat: 45.5051,
  lng: -122.6750,
  name: "Modern Loft in Pearl District",
  description: "A modern loft located in the trendy Pearl District. Perfect for business travelers and tourists.",
  price: 200.00,
  ownerId: 3
},
{
  address: "101 Pine St",
  city: "Austin",
  state: "TX",
  country: "USA",
  lat: 30.2672,
  lng: -97.7431,
  name: "Spacious House with Pool",
  description: "A spacious house with a private pool. Ideal for families and groups visiting Austin.",
  price: 300.00,
  ownerId: 1
},
{
  address: "202 Maple St",
  city: "New York",
  state: "NY",
  country: "USA",
  lat: 40.7128,
  lng: -74.0060,
  name: "Luxury Condo in Manhattan",
  description: "A luxury condo located in the heart of Manhattan. Enjoy stunning views and top-notch amenities.",
  price: 400.00,
  ownerId: 2
}
];

/** @type {import('sequelize-cli').Migration} */
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
    await Spot.bulkCreate(spots, {validate: true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await Spot.destroy({ where: {}, truncate: true });
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'hui@gmail.com',
      firstName: 'dinh',
      lastName: 'Huii',
      password: '123456',
      address: 'ST',
      gender: '1',
      roleId: 'R1',
      phoneNumber: '01636644594',
      image: '',
      positionId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    // return queryInterface.bulkDelete('Users', null, {});
  }
};
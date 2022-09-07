module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        "Users",
        "image",
        {
          type: Sequelize.BLOB("long"),
          allowNull: true,
        }
        // {
        //   transaction,
        // }
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        "Users",
        "image",
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
        // {
        //   transaction,
        // }
      ),
    ]);
  },
};

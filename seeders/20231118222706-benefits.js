const { faker } = require('@faker-js/faker');
('use strict');

const benefitCategory = [
  'Cinema and theater',
  'Sport and health',
  'Concerts and shows',
  'Beauty and SPA',
  'Restaurants and bars',
  'Travel and tourism',
  'Shopping and gifts',
  'Education and development',
  'Other',
];
const benefitType = [
  'Subscription',
  'Certificate',
  'Gift card',
  'Discount',
  'Other',
];
const benefitImage = [
  faker.image.fashion(),
  faker.image.food(),
  faker.image.nature(),
  faker.image.nightlife(),
  faker.image.people(),
  faker.image.sports(),
  faker.image.transport(),
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'Benefits',
      [...Array(100)].map(() => {
        const benefitCategoryIndex = Math.floor(
          Math.random() * benefitCategory.length,
        );
        const benefitTypeIndex = Math.floor(Math.random() * benefitType.length);
        const priceLength = Math.floor(Math.random() * 2 + 2);
        const benefitImageIndex = Math.floor(
          Math.random() * benefitImage.length,
        );
        return {
          benefit_name: faker.lorem.sentence(2),
          benefit_type: benefitType[benefitTypeIndex],
          benefit_category: benefitCategory[benefitCategoryIndex],
          benefit_description: faker.lorem.sentence(10),
          price: faker.random.numeric(priceLength),
          vendor_code: faker.internet.password(),
          benefit_image: `${
            benefitImage[benefitImageIndex]
          }?random=${faker.random.numeric(30)}`,
          in_stock: faker.random.numeric(1),
          bestseller: faker.datatype.boolean(),
          new: faker.datatype.boolean(),
          popularity: faker.random.numeric(3),
          info: faker.lorem.sentence(7),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Benefits', null, {});
  },
};

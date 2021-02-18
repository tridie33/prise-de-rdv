const { connectToMongoForTests, cleanAll } = require("./testUtils.js");
const createComponents = require("../../src/common/components/components");
const { nockApis } = require("./nockApis");

module.exports = (desc, cb) => {
  describe(desc, function () {
    let context;

    beforeEach(async () => {
      let [{ db }] = await Promise.all([connectToMongoForTests()]);
      const components = await createComponents({ db });
      context = { db, components };
      await nockApis();
    });

    cb({ getContext: () => context });

    afterEach(cleanAll);
  });
};

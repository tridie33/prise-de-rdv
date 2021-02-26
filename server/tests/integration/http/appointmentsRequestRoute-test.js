const assert = require("assert");
const httpTests = require("../../utils/httpTests");
const widgetParameters = require("../../../src/common/components/widgetParameters");
const { sampleParameter } = require("../../data/samples");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie qu'on peut récupérer les infos de context pour un siret et un cfd", async () => {
    const { createParameter } = await widgetParameters();

    const created = await createParameter(sampleParameter);
    const { httpClient } = await startServer();

    const siret = created.etablissement_siret;
    const cfd = created.formation_cfd;
    const referrer = "lba";
    const urlQuery = `siret=${siret}&cfd=${cfd}&referrer=${referrer}`;

    const response = await httpClient.get(`/api/appointment-request/context/create?${urlQuery}`);

    assert.strictEqual(response.status, 200);
    assert.ok(response.data.etablissement);
    assert.ok(response.data.formation);
  });

  it("Vérifie que le context n'est pas retourné si la prise de rendez-vous n'est pas activée", async () => {
    const { httpClient } = await startServer();

    const siret = "7500000000";
    const cfd = "32025515";
    const referrer = "lba";
    const urlQuery = `siret=${siret}&cfd=${cfd}&referrer=${referrer}`;
    const response = await httpClient.get(`/api/appointment-request/context/create?${urlQuery}`);

    assert.strictEqual(response.status, 200);
    assert.ok(response.data.error);
  });
});

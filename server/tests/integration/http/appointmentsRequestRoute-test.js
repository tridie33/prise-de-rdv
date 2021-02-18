const assert = require("assert");
const httpTests = require("../../utils/httpTests");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie qu'on peut récupérer les infos de context pour un uai / educnatcode", async () => {
    const { httpClient } = await startServer();

    const etablissementUai = "0751475W";
    const formationId = "45025516";
    const urlQuery = `etablissementUai=${etablissementUai}&formationId=${formationId}`;
    const response = await httpClient.get(`/api/appointment-request/context/create?${urlQuery}`);

    assert.strictEqual(response.status, 200);
    assert.ok(response.data.etablissement);
    assert.ok(response.data.formation);
  });
});

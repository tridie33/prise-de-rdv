const assert = require("assert");
const httpTests = require("../../utils/httpTests");
const { administrator } = require("../../../src/common/roles");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie qu'on peut récupérer les stats en tant qu'admin", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    const bearerToken = await createAndLogUser("userAdmin", "password", { role: administrator });

    const response = await httpClient.get("/api/stats", { headers: bearerToken });
    assert.strictEqual(response.status, 200);
    assert.ok(response.data.stats);
  });

  it("Vérifie qu'on peut récupérer les infos de context pour un uai / educnatcode", async () => {
    const { httpClient } = await startServer();

    const centreId = "0751475W";
    const trainingId = "45025516";
    const response = await httpClient.get(
      `/api/appointment/context/create?centreId=${centreId}&trainingId=${trainingId}`
    );
    assert.strictEqual(response.status, 200);
    assert.ok(response.data.centre);
    assert.ok(response.data.training);
  });
});

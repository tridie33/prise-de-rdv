const assert = require("assert");
const httpTests = require("../../utils/httpTests");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie que l'on transfert bien la requête au catalogue", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/catalogue/formations");

    assert.strictEqual(response.status, 200);
    assert.ok(response.data.formations);
    assert.ok(response.data.pagination);
  });
});

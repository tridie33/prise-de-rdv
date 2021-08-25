const assert = require("assert");
const httpTests = require("../../utils/httpTests");
const { administrator, candidat, cfa } = require("../../../src/common/roles");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie qu'on peut se connecter à une route sécurisée en tant qu'administrateur", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    const bearerToken = await createAndLogUser("userAdmin", "password", { role: administrator });

    const response = await httpClient.get("/api/authentified", { headers: bearerToken });
    assert.strictEqual(response.status, 200);
  });

  it("Vérifie qu'on peut se connecter à une route d'admin en tant qu'administrateur", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    const bearerToken = await createAndLogUser("userAdmin", "password", { role: administrator });

    const response = await httpClient.get("/api/admin", { headers: bearerToken });
    assert.strictEqual(response.status, 200);
  });

  it("Vérifie qu'on peut se connecter à une route sécurisée en tant que candidat", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    const bearerToken = await createAndLogUser("userCandidat", "password", { role: candidat });

    const response = await httpClient.get("/api/authentified", { headers: bearerToken });
    assert.strictEqual(response.status, 200);
  });

  it("Vérifie qu'on ne peut pas se connecter à une route d'admin en tant que candidat", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    const bearerToken = await createAndLogUser("userCandidat", "password", { role: candidat });

    const response = await httpClient.get("/api/admin", { headers: bearerToken });
    assert.notStrictEqual(response.status, 200);
  });

  it("Vérifie qu'on peut se connecter à une route sécurisée en tant que cfa", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    const bearerToken = await createAndLogUser("userCfa", "password", { role: cfa });

    const response = await httpClient.get("/api/authentified", { headers: bearerToken });
    assert.strictEqual(response.status, 200);
  });

  it("Vérifie qu'on ne peut pas se connecter à une route d'admin en tant que cfa", async () => {
    const { httpClient, createAndLogUser } = await startServer();
    const bearerToken = await createAndLogUser("userCfa", "password", { role: cfa });

    const response = await httpClient.get("/api/admin", { headers: bearerToken });
    assert.notStrictEqual(response.status, 200);
  });
});

const assert = require("assert");
const httpTests = require("../../utils/httpTests");
const widgetParameters = require("../../../src/common/components/widgetParameters");
const { sampleParameter } = require("../../data/samples");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie qu'on peut récupérer les infos de context pour un siret et un cfd", async () => {
    const { createParameter } = await widgetParameters();

    await createParameter(sampleParameter);
    const { httpClient } = await startServer();

    const referrer = "lba";

    const response = await httpClient.post(`/api/appointment-request/context/create`, {
      idRcoFormation: sampleParameter.id_rco_formation,
      referrer,
    });

    assert.strictEqual(response.status, 200);
    assert.ok(response.data.etablissement_formateur_entreprise_raison_sociale);
    assert.ok(response.data.intitule_long);
    assert.ok(response.data.lieu_formation_adresse);
    assert.ok(response.data.code_postal);
    assert.ok(response.data.etablissement_formateur_siret);
    assert.ok(response.data.cfd);
    assert.ok(response.data.localite);
    assert.ok(response.data.id_rco_formation);
    assert.ok(response.data.form_url);
  });

  it("Vérifie que le context n'est pas retourné si la prise de rendez-vous n'est pas activée", async () => {
    const { httpClient } = await startServer();

    const referrer = "lba";

    const response = await httpClient.post(`/api/appointment-request/context/create`, {
      idRcoFormation: "KO",
      referrer,
    });

    assert.strictEqual(response.status, 200);
    assert.ok(response.data.error);
  });
});

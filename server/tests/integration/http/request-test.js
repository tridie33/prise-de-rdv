const assert = require("assert");
const { Candidat, Request } = require("../../../src/common/model");
const httpTests = require("../../utils/httpTests");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie que l'enregistrement du candidat et de la demande ont bien été effectué", async () => {
    // Given
    const { httpClient } = await startServer();

    // When
    const response = await httpClient.post("/api/request/", {
      centreId: "0831760M",
      email: "j.doe@gmail.com",
      firstname: "John",
      lastname: "Doe",
      motivations: "Pré-inscription",
      phone: "1234567890",
      referrer: "LBA",
      trainingId: "13531545",
    });

    // Then
    const candidatExpected = {
      email: "j.doe@gmail.com",
      firstname: "John",
      lastname: "Doe",
      phone: "1234567890",
    };
    const requestExpected = {
      centreId: "0831760M",
      motivations: "Pré-inscription",
      referrer: "LBA",
      trainingId: "13531545",
    };
    assert.strictEqual(response.status, 200);
    const candidatReceived = await Candidat.findOne(candidatExpected);
    assert.strictEqual(candidatExpected.email, candidatReceived.email);
    const requestReceived = await Request.findOne(requestExpected);
    assert.strictEqual(requestExpected.centreId, requestReceived.centreId);
  });
});

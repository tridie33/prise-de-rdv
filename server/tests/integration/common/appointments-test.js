const assert = require("assert");
const integrationTests = require("../../utils/integrationTests");
const appointments = require("../../../src/common/components/appointments");
const users = require("../../../src/common/components/users");
const { Request } = require("../../../src/common/model");
const { candidat } = require("../../../src/common/roles");

integrationTests(__filename, () => {
  it("Permet de créer un appointment", async () => {
    const { createAppointment } = await appointments();
    const { createUser } = await users();

    const createdCandidat = await createUser("userCandidat", "password", { role: candidat });

    const created = await createAppointment({
      candidatId: createdCandidat._id,
      motivations: "Test Motivation",
      centreId: "0751475W",
      trainingId: "45025516",
      referrer: "TEST",
    });
    assert.strictEqual(created.motivations, "Test Motivation");
    assert.strictEqual(created.etablissement_id, "0751475W");
    assert.strictEqual(created.formation_id, "45025516");
    assert.strictEqual(created.referrer, "TEST");

    const foundAppointment = await Request.findOne({
      etablissement_id: "0751475W",
      formation_id: "45025516",
      referrer: "TEST",
    });
    assert.notStrictEqual(foundAppointment, null);
  });

  it("Permet de récupérer un appointment", async () => {
    const { createAppointment, getAppointmentById } = await appointments();
    const { createUser } = await users();

    const createdCandidat = await createUser("userCandidat", "password", { role: candidat });
    const created = await createAppointment({
      candidatId: createdCandidat._id,
      motivations: "Test Motivation",
      centreId: "0751475W",
      trainingId: "45025516",
      referrer: "TEST",
    });

    const found = await getAppointmentById(created._id);
    assert.strictEqual(found.motivations, "Test Motivation");
    assert.strictEqual(found.etablissement_id, "0751475W");
    assert.strictEqual(found.formation_id, "45025516");
    assert.strictEqual(found.referrer, "TEST");
  });

  it("Permet de mettre à jour un appointment", async () => {
    const { createAppointment, updateAppointment } = await appointments();
    const { createUser } = await users();

    const createdCandidat = await createUser("userCandidat", "password", { role: candidat });
    const created = await createAppointment({
      candidatId: createdCandidat._id,
      motivations: "Test Motivation",
      centreId: "0751475W",
      trainingId: "45025516",
      referrer: "TEST",
    });

    const updated = await updateAppointment(created._id, {
      candidatId: createdCandidat._id,
      motivations: "Updated",
      etablissement_id: "Updated",
      formation_id: "Updated",
      referrer: "Updated",
    });
    assert.strictEqual(updated.motivations, "Updated");
    assert.strictEqual(updated.etablissement_id, "Updated");
    assert.strictEqual(updated.formation_id, "Updated");
    assert.strictEqual(updated.referrer, "Updated");
  });

  it("Permet de mettre à jour le statut mail ouvert par un cfa pour un appointment", async () => {
    const { createAppointment, updateStatusMailOpenedByCentre } = await appointments();
    const { createUser } = await users();

    const createdCandidat = await createUser("userCandidat", "password", { role: candidat });
    const created = await createAppointment({
      candidatId: createdCandidat._id,
      motivations: "Test Motivation",
      centreId: "0751475W",
      trainingId: "45025516",
      referrer: "TEST",
    });

    const updated = await updateStatusMailOpenedByCentre(created._id);
    assert.strictEqual(updated.email_premiere_demande_cfa_ouvert, true);
  });

  it("Permet de mettre à jour le statut mail ouvert par un candidat pour un appointment", async () => {
    const { createAppointment, updateStatusMailOpenedByCandidat } = await appointments();
    const { createUser } = await users();

    const createdCandidat = await createUser("userCandidat", "password", { role: candidat });
    const created = await createAppointment({
      candidatId: createdCandidat._id,
      motivations: "Test Motivation",
      centreId: "0751475W",
      trainingId: "45025516",
      referrer: "TEST",
    });

    const updated = await updateStatusMailOpenedByCandidat(created._id);
    assert.strictEqual(updated.email_premiere_demande_candidat_ouvert, true);
  });

  it("Permet de mettre à jour le statut mails envoyes pour un appointment", async () => {
    const { createAppointment, updateStatusMailsSend } = await appointments();
    const { createUser } = await users();

    const createdCandidat = await createUser("userCandidat", "password", { role: candidat });
    const created = await createAppointment({
      candidatId: createdCandidat._id,
      motivations: "Test Motivation",
      centreId: "0751475W",
      trainingId: "45025516",
      referrer: "TEST",
    });

    const updated = await updateStatusMailsSend(created._id);
    assert.strictEqual(updated.email_premiere_demande_candidat_envoye, true);
    assert.strictEqual(updated.email_premiere_demande_cfa_envoye, true);
  });
});

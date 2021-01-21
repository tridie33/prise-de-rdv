const assert = require("assert");
const integrationTests = require("../../utils/integrationTests");
const widgetParameters = require("../../../src/common/components/widgetParameters");
const { WidgetParameters } = require("../../../src/common/model");
const { codesReferrersSites } = require("../../../src/common/model/constants");
const { sampleParameter, sampleUpdateParameter } = require("../../data/samples");

integrationTests(__filename, () => {
  it("Permet de créer un paramètre de Widget", async () => {
    const { createParameter } = await widgetParameters();

    const created = await createParameter({
      etablissement_siret: sampleParameter.etablissement_siret,
      etablissement_raison_sociale: sampleParameter.etablissement_raison_sociale,
      formation_intitule: sampleParameter.formation_intitule,
      formation_cfd: sampleParameter.formation_cfd,
      email_rdv: sampleParameter.email_rdv,
      referrers: sampleParameter.referrers,
    });

    // Check creation
    assert.deepStrictEqual(created.etablissement_siret, sampleParameter.etablissement_siret);
    assert.deepStrictEqual(created.etablissement_raison_sociale, sampleParameter.etablissement_raison_sociale);
    assert.deepStrictEqual(created.formation_intitule, sampleParameter.formation_intitule);
    assert.deepStrictEqual(created.formation_cfd, sampleParameter.formation_cfd);
    assert.deepStrictEqual(created.email_rdv, sampleParameter.email_rdv);
    assert.deepStrictEqual(created.referrers.includes(codesReferrersSites.LBA), true);

    // Check query db
    const found = await WidgetParameters.findById(created._id);
    assert.deepStrictEqual(found.etablissement_siret, sampleParameter.etablissement_siret);
    assert.deepStrictEqual(found.etablissement_raison_sociale, sampleParameter.etablissement_raison_sociale);
    assert.deepStrictEqual(found.formation_intitule, sampleParameter.formation_intitule);
    assert.deepStrictEqual(found.formation_cfd, sampleParameter.formation_cfd);
    assert.deepStrictEqual(found.email_rdv, sampleParameter.email_rdv);
    assert.deepStrictEqual(found.referrers.includes(codesReferrersSites.LBA), true);
  });

  it("Permet de supprimer un paramètres de Widget", async () => {
    const { createParameter, deleteParameter } = await widgetParameters();

    const created = await createParameter({
      etablissement_siret: sampleParameter.etablissement_siret,
      etablissement_raison_sociale: sampleParameter.etablissement_raison_sociale,
      formation_intitule: sampleParameter.formation_intitule,
      formation_cfd: sampleParameter.formation_cfd,
      email_rdv: sampleParameter.email_rdv,
      referrers: sampleParameter.referrers,
    });

    // Check creation
    assert.deepStrictEqual(created.etablissement_siret, sampleParameter.etablissement_siret);
    assert.deepStrictEqual(created.etablissement_raison_sociale, sampleParameter.etablissement_raison_sociale);
    assert.deepStrictEqual(created.formation_intitule, sampleParameter.formation_intitule);
    assert.deepStrictEqual(created.formation_cfd, sampleParameter.formation_cfd);
    assert.deepStrictEqual(created.email_rdv, sampleParameter.email_rdv);
    assert.deepStrictEqual(created.referrers.includes(codesReferrersSites.LBA), true);

    await deleteParameter(created._id);

    // Check deletion
    const found = await WidgetParameters.findById(created._id);
    assert.strictEqual(found, null);
  });

  it("Permet de modifier un paramètre de Widget", async () => {
    const { createParameter, updateParameter } = await widgetParameters();

    const created = await createParameter({
      etablissement_siret: sampleParameter.etablissement_siret,
      etablissement_raison_sociale: sampleParameter.etablissement_raison_sociale,
      formation_intitule: sampleParameter.formation_intitule,
      formation_cfd: sampleParameter.formation_cfd,
      email_rdv: sampleParameter.email_rdv,
      referrers: sampleParameter.referrers,
    });

    // Check creation
    assert.deepStrictEqual(created.etablissement_siret, sampleParameter.etablissement_siret);
    assert.deepStrictEqual(created.etablissement_raison_sociale, sampleParameter.etablissement_raison_sociale);
    assert.deepStrictEqual(created.formation_intitule, sampleParameter.formation_intitule);
    assert.deepStrictEqual(created.formation_cfd, sampleParameter.formation_cfd);
    assert.deepStrictEqual(created.email_rdv, sampleParameter.email_rdv);
    assert.deepStrictEqual(created.referrers.includes(codesReferrersSites.LBA), true);

    await updateParameter(created._id, sampleUpdateParameter);

    // Check update
    const found = await WidgetParameters.findById(created._id);
    assert.deepStrictEqual(found.etablissement_siret, sampleUpdateParameter.etablissement_siret);
    assert.deepStrictEqual(found.etablissement_raison_sociale, sampleUpdateParameter.etablissement_raison_sociale);
    assert.deepStrictEqual(found.formation_intitule, sampleUpdateParameter.formation_intitule);
    assert.deepStrictEqual(found.formation_cfd, sampleUpdateParameter.formation_cfd);
    assert.deepStrictEqual(found.email_rdv, sampleUpdateParameter.email_rdv);
    assert.deepStrictEqual(found.referrers.includes(codesReferrersSites.PARCOURSUP), true);
  });

  it("Permet de vérifier que le widget doit etre visible pour un paramètre valide", async () => {
    const { createParameter, isWidgetVisible } = await widgetParameters();

    const created = await createParameter({
      etablissement_siret: sampleParameter.etablissement_siret,
      etablissement_raison_sociale: sampleParameter.etablissement_raison_sociale,
      formation_intitule: sampleParameter.formation_intitule,
      formation_cfd: sampleParameter.formation_cfd,
      email_rdv: sampleParameter.email_rdv,
      referrers: sampleParameter.referrers,
    });

    // Check creation
    assert.deepStrictEqual(created.etablissement_siret, sampleParameter.etablissement_siret);
    assert.deepStrictEqual(created.etablissement_raison_sociale, sampleParameter.etablissement_raison_sociale);
    assert.deepStrictEqual(created.formation_intitule, sampleParameter.formation_intitule);
    assert.deepStrictEqual(created.formation_cfd, sampleParameter.formation_cfd);
    assert.deepStrictEqual(created.email_rdv, sampleParameter.email_rdv);
    assert.deepStrictEqual(created.referrers.includes(codesReferrersSites.LBA), true);

    // Check update
    const isVisible = await isWidgetVisible({
      etablissement_siret: sampleParameter.etablissement_siret,
      formation_cfd: sampleParameter.formation_cfd,
      referrer: codesReferrersSites.LBA,
    });
    assert.deepStrictEqual(isVisible, true);
  });

  it("Permet de vérifier que le widget ne doit pas etre visible pour de mauvais paramètres", async () => {
    const { createParameter, isWidgetVisible } = await widgetParameters();

    const created = await createParameter({
      etablissement_siret: sampleParameter.etablissement_siret,
      etablissement_raison_sociale: sampleParameter.etablissement_raison_sociale,
      formation_intitule: sampleParameter.formation_intitule,
      formation_cfd: sampleParameter.formation_cfd,
      email_rdv: sampleParameter.email_rdv,
      referrers: sampleParameter.referrers,
    });

    // Check creation
    assert.deepStrictEqual(created.etablissement_siret, sampleParameter.etablissement_siret);
    assert.deepStrictEqual(created.etablissement_raison_sociale, sampleParameter.etablissement_raison_sociale);
    assert.deepStrictEqual(created.formation_intitule, sampleParameter.formation_intitule);
    assert.deepStrictEqual(created.formation_cfd, sampleParameter.formation_cfd);
    assert.deepStrictEqual(created.email_rdv, sampleParameter.email_rdv);
    assert.deepStrictEqual(created.referrers.includes(codesReferrersSites.LBA), true);

    // Check if widget is visible
    const isVisibleForBadReferrer = await isWidgetVisible({
      etablissement_siret: sampleParameter.etablissement_siret,
      formation_cfd: sampleParameter.formation_cfd,
      referrer: "KO",
    });
    const isVisibleForBadSiret = await isWidgetVisible({
      etablissement_siret: "BADSIRET",
      formation_cfd: sampleParameter.formation_cfd,
      referrer: codesReferrersSites.LBA,
    });
    const isVisibleForBadCfd = await isWidgetVisible({
      etablissement_siret: sampleParameter.etablissement_siret,
      formation_cfd: "BADCFD",
      referrer: codesReferrersSites.LBA,
    });

    assert.deepStrictEqual(isVisibleForBadReferrer, false);
    assert.deepStrictEqual(isVisibleForBadSiret, false);
    assert.deepStrictEqual(isVisibleForBadCfd, false);
  });
});

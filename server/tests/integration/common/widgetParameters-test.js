const assert = require("assert");
const integrationTests = require("../../utils/integrationTests");
const widgetParameters = require("../../../src/common/components/widgetParameters");
const { WidgetParameter } = require("../../../src/common/model");
const { referrers } = require("../../../src/common/model/constants/referrers");
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
    assert.deepStrictEqual(created.referrers.includes(referrers.LBA.code), true);

    // Check query db
    const found = await WidgetParameter.findById(created._id);
    assert.deepStrictEqual(found.etablissement_siret, sampleParameter.etablissement_siret);
    assert.deepStrictEqual(found.etablissement_raison_sociale, sampleParameter.etablissement_raison_sociale);
    assert.deepStrictEqual(found.formation_intitule, sampleParameter.formation_intitule);
    assert.deepStrictEqual(found.formation_cfd, sampleParameter.formation_cfd);
    assert.deepStrictEqual(found.email_rdv, sampleParameter.email_rdv);
    assert.deepStrictEqual(found.referrers.includes(referrers.LBA.code), true);
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
    assert.deepStrictEqual(created.referrers.includes(referrers.LBA.code), true);

    await deleteParameter(created._id);

    // Check deletion
    const found = await WidgetParameter.findById(created._id);
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
    assert.deepStrictEqual(created.referrers.includes(referrers.LBA.code), true);

    await updateParameter(created._id, sampleUpdateParameter);

    // Check update
    const found = await WidgetParameter.findById(created._id);
    assert.deepStrictEqual(found.etablissement_siret, sampleUpdateParameter.etablissement_siret);
    assert.deepStrictEqual(found.etablissement_raison_sociale, sampleUpdateParameter.etablissement_raison_sociale);
    assert.deepStrictEqual(found.formation_intitule, sampleUpdateParameter.formation_intitule);
    assert.deepStrictEqual(found.formation_cfd, sampleUpdateParameter.formation_cfd);
    assert.deepStrictEqual(found.email_rdv, sampleUpdateParameter.email_rdv);
    assert.deepStrictEqual(found.referrers.includes(referrers.PARCOURSUP.code), true);
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
    assert.deepStrictEqual(created.referrers.includes(referrers.LBA.code), true);

    // Check update
    const isVisible = await isWidgetVisible({
      siret: sampleParameter.etablissement_siret,
      cfd: sampleParameter.formation_cfd,
      referrer: referrers.LBA.code,
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
    assert.deepStrictEqual(created.referrers.includes(referrers.LBA.code), true);

    // Check if widget is visible
    const isVisibleForBadReferrer = await isWidgetVisible({
      siret: sampleParameter.etablissement_siret,
      cfd: sampleParameter.formation_cfd,
      referrer: "KO",
    });
    const isVisibleForBadSiret = await isWidgetVisible({
      siret: "BADSIRET",
      cfd: sampleParameter.formation_cfd,
      referrer: referrers.LBA.code,
    });
    const isVisibleForBadCfd = await isWidgetVisible({
      siret: sampleParameter.etablissement_siret,
      cfd: "BADCFD",
      referrer: referrers.LBA.code,
    });

    assert.deepStrictEqual(isVisibleForBadReferrer, false);
    assert.deepStrictEqual(isVisibleForBadSiret, false);
    assert.deepStrictEqual(isVisibleForBadCfd, false);
  });
});

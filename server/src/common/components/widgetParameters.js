const { WidgetParameters } = require("../model/index");

module.exports = async () => {
  return {
    createParameter: async ({
      etablissement_siret,
      etablissement_raison_sociale,
      formation_intitule,
      formation_cfd,
      email_rdv,
      referrers,
    }) => {
      const toAdd = new WidgetParameters({
        etablissement_siret,
        etablissement_raison_sociale,
        formation_intitule,
        formation_cfd,
        email_rdv,
        referrers,
      });
      await toAdd.save();
      return toAdd.toObject();
    },

    updateParameter: async (requestId, body) => {
      return await WidgetParameters.findOneAndUpdate({ _id: requestId }, body, { new: true });
    },

    deleteParameter: async (requestId) => {
      return await WidgetParameters.findByIdAndDelete(requestId);
    },

    isWidgetVisible: async ({ etablissement_siret, formation_cfd, referrer }) => {
      return await WidgetParameters.exists({
        etablissement_siret: etablissement_siret,
        formation_cfd: formation_cfd,
        referrers: { $in: [referrer] },
      });
    },
  };
};

module.exports = async () => {
  return {
    createRequest: async (firstname, lastname, phone, email, centreId, trainingId) => {
      console.log(firstname, lastname, phone, email, centreId, trainingId);
    },
  };
};

module.exports = {
  responseBody: (body) => {
    return JSON.stringify({ message: body });
  },
};

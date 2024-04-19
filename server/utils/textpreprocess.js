const BadWordsFilter = require("bad-words");

const textfiltering = (input) => {
  const filter = new BadWordsFilter();
  return filter.isProfane(input);
};

const preprocessing = (input) => {
  input = input.trim();
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

module.exports = { preprocessing, textfiltering };

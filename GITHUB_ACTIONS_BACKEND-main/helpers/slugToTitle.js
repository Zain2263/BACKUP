const slugToTitle = (slug) => {
  const words = slug.split("-");
  const titleCaseWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return titleCaseWords.join(" ");
};

module.exports = slugToTitle;

const moment = require("moment");
moment.locale("en");
module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("dateIso", (date) => {
    return moment(date).toISOString();
  });
  eleventyConfig.addFilter("dateReadable", (date) => moment(date).format("LL"));
  eleventyConfig.addShortcode("excerpt", (article) => extractExcerpt(article));
  eleventyConfig.addPassthroughCopy("static");
};

function extractExcerpt(article) {
  if (!article.hasOwnProperty("templateContent")) {
    console.warn(
      'Failed to extract excerpt: Document has no property "templateContent".'
    );
    return null;
  }
  let excerpt = null;
  const content = article.templateContent;
  const seperatorsList = [
    { start: "<!-- Excerpt Start -->", end: "<!-- Excerpt End -->" },
    { start: "<p>", end: "</p>" },
  ];

  seperatorsList.some((seperators) => {
    const startPosition = content.indexOf(seperators.start);
    const endPosition = content.lastIndexOf(seperators.end);

    if (startPosition !== -1 && endPosition !== -1) {
      excerpt = content
        .substring(startPosition + seperators.start.length, endPosition)
        .trim();
      return true;
    }
    return excerpt;
  });
}

const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  // Configure markdown-it
  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true
  });
  
  // Add markdown filter
  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content);
  });
  
  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
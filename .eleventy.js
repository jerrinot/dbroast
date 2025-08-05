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
  
  // Add slug filter for creating URL-friendly slugs
  eleventyConfig.addFilter("slug", (content) => {
    return content.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single
      .trim();
  });
  
  // Add date filter
  eleventyConfig.addFilter("date", (dateObj, format) => {
    const date = new Date(dateObj);
    if (format === "readable") {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return date.toISOString().split('T')[0];
  });
  
  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    pathPrefix: "/dbroast/"
  };
};
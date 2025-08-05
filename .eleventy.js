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
  
  // Add escape filter for XML
  eleventyConfig.addFilter("escape", (content) => {
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
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
    if (format === "%Y-%m-%dT%H:%M:%SZ") {
      return date.toISOString();
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
  };
};
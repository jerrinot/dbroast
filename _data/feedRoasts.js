module.exports = async function() {
  // Simply re-export the roasts data for the feed
  const roasts = await require('./roasts.js')();
  return roasts;
};
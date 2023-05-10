const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1366,
  viewportHeight: 768,
  e2e: {
    setupNodeEvents(on, config) {},
  },
});

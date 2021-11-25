const PROJECT_TITLE = "Christmas Tree Party";
const PROJECT_DESCRIPTION = "Add a tree to the party";
const PROJECT_KEYWORDS = "Christmas Tree Party"; // add more
const PROJECT_DOMAIN = "https://christmas-party.jthaw.club";

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: PROJECT_TITLE,
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0",
      },
      { name: "referrer", content: "no-referrer" },
      {
        name: "title",
        content: PROJECT_TITLE,
      },
      {
        hid: "description",
        name: "description",
        content: PROJECT_DESCRIPTION,
      },
      {
        name: "keywords",
        content: PROJECT_KEYWORDS,
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      { name: "twitter:site", content: "@jthawme" },
      {
        name: "twitter:title",
        content: PROJECT_TITLE,
      },
      {
        name: "twitter:description",
        content: PROJECT_DESCRIPTION,
      },
      {
        name: "twitter:image:src",
        content: `${PROJECT_DOMAIN}/social/sharecard.png`,
      },
      {
        name: "og:title",
        property: "og:title",
        content: PROJECT_TITLE,
      },
      { name: "og:type", property: "og:type", content: "website" },
      {
        name: "og:url",
        property: "og:url",
        content: `${PROJECT_DOMAIN}`,
      },
      {
        name: "og:image",
        property: "og:image",
        content: `${PROJECT_DOMAIN}/social/sharecard.png`,
      },
      {
        name: "og:description",
        property: "og:description",
        content: PROJECT_DESCRIPTION,
      },
      {
        name: "og:site_name",
        property: "og:site_name",
        content: PROJECT_TITLE,
      },
      { name: "author", content: "Jonny Thaw" },
      { meta: "msapplication-TileColor", content: "#ffffff" },
      { meta: "msapplication-TileImage", content: "/ms-icon-144x144.png" },
      { meta: "theme-color", content: "#ffffff" },
    ],
    // script: [
    //   {
    //     src:
    //       process.env.NODE_ENV !== "production"
    //         ? "https://plausible.io/js/plausible.local.js"
    //         : "https://plausible.io/js/plausible.js",
    //     ["data-domain"]: "lastyears.singles",
    //     defer: true,
    //   },
    //   {
    //     innerHTML: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
    //     type: "text/javascript",
    //     charset: "utf-8",
    //   },
    // ],
    // __dangerouslyDisableSanitizers: ["script", "innerHTML"],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["normalize.css"],

  styleResources: {
    scss: ["~/assets/scss/common.scss"],
  },

  plugins: [],

  components: {
    dirs: ["~/components", "~/components/common"],
  },

  buildModules: ["@nuxtjs/svg", "@nuxtjs/style-resources"],

  modules: ["@nuxtjs/pwa", "@nuxt/http", "@nuxtjs/markdownit"],

  markdownit: {
    injected: true,
    html: true,
  },

  pwa: {
    manifest: {
      lang: "en",
    },
  },

  build: {
    extend(config, context) {
      if (context.isClient) {
        config.externals = ["fs", "path"];
      }
    },
    transpile: [
      // "animejs",
      "three/examples/jsm/loaders/GLTFLoader",
      "three/examples/jsm/controls/OrbitControls",
      "three/examples/jsm/utils/BufferGeometryUtils",
    ],
  },
};

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  env: {
    GOOGLE_MAPS_API_KEY: "AIzaSyBb19oZKDoAibzEcIOe1T2akq8KUBAMfAA",
    GEOCODING_API_KEY: "AIzaSyBb19oZKDoAibzEcIOe1T2akq8KUBAMfAA",
    TENOR_API_KEY: "AIzaSyAyTPTM2LK6fOSULHMJ9QRES7GirP_iVH8", // for local testing replace "AIzaSyDtvt4sAPbLyAiyQsnunqFKtvEIkATvwcc"
  },
  async redirects() {
    return [
      {
        source: "/:locale/private/profile",
        destination: "/:locale/private/profile/personal",
        permanent: true,
        locale: false,
      },
    ];
  },
  // i18n: {
  //   locales: ["en", "et", "ru"],
  //   defaultLocale: "et",
  // },
};

export default config;

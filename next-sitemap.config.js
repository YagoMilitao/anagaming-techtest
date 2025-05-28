/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://anagaming.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};

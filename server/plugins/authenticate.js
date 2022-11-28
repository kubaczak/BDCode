const fp = require("fastify-plugin")

module.exports = fp(async function(fastify, opts) {
  fastify.register(require('@fastify/jwt'), {
    secret: 'Peszka78',
    cookie: {
        cookieName: 'token',
        signed: false,
      },
  });

  fastify.register(require('@fastify/cookie'));
})
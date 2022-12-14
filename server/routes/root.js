'use strict';

module.exports = async function(fastify, opts) {
    fastify.get('/', async function(request, reply) {
        return { root: true };
    });

    fastify.get('/*', async function(request, reply) {
        reply.code(404).send({error: "Strona nie istnieje"})
    });

    fastify.get('/teapot', async function(req, res) {
        res.status(418)
        return "I'm a teapot!"
    })
};
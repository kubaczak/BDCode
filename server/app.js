'use strict';

const path = require('path');
const AutoLoad = require('@fastify/autoload');
const mongoose = require('mongoose');
const cors = require("@fastify/cors");

module.exports = async function(fastify, opts) {
    // Place here your custom code!
    try {
        const uri = process.env.ATLAS_URI;
        mongoose.connect(uri);
        console.log('Polączono z mongodb');
    } catch (e) {
        console.error(e);
    }

    fastify.register(cors, {
        origin: 'http://localhost:5173',
        credentials: true,
        methods: '*'
    })
    // Do not touch the following lines

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: Object.assign({}, opts),
    });

    // This loads all plugins defined in routes
    // define your routes in one of these
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: Object.assign({}, opts),
    });
};
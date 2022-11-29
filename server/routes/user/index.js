'use strict';

const User = require('../../models/user.js');

module.exports = async function(fastify, opts) {
    fastify.addHook('onRequest', (request) =>
        request.jwtVerify().catch(() => {
            console.log('Brak autoryzacji');
        })
    );

    fastify.get('/', async function(request, reply) {
        if (!request.user) return { error: 'Użytkownik niezalogowany!' };
        let user = await User.findById( request.user.id );
        if (user == null) return { error: 'Taki użytkownik nie istnieje!' };
        let id = user.id;
        let username = user.username;
        let email = user.email;
        return {
            id,
            username,
            email,
        };
    });

    fastify.put('/', async function(request, reply) {
        if (!request.user) return { error: 'Użytkownik niezalogowany!' };
        let user = await User.findById( request.user.id );
        if (user == null) return { error: 'Taki użytkownik nie istnieje!' };
        let username = request.body.username ?? request.user.nick;
        let re = /\S+@\S+\.\S+/;
        let email = request.user.email;
        if(request.body.email && re.test(request.body.email))
            email = request.body.email;
        let password = request.body.password&&bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(10));
        // if(request.body.password){
        //     const salt = bcrypt.genSaltSync(10);
        //     password = bcrypt.hashSync(request.body.password, salt);
        // }
        await User.findByIdAndUpdate(
            request.user.id, 
        {
            username,
            email,
            password
        });
        return {reply: "Zmieniono dane użytkownika!", id}
    });

    fastify.delete('/', async function(request, reply){
        if (!request.user) return { error: 'Użytkownik niezalogowany!' };
        let user = await User.findById( request.user.id );
        if (user == null) return { error: 'Taki użytkownik nie istnieje!' };
        await User.findByIdAndRemove( request.user.id );
        return {reply: "Usunięto użytkownika!"}
    })
};
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
        return {
            id: request.user.id,
            nick: request.user.nick,
            email: request.user.email,
        };
    });

    fastify.put('/:username', async function(request, reply) {
        if (!request.user) return { error: 'Użytkownik niezalogowany!' };
        let user = await User.findOne({ username: request.params.username });
        if (user == null) return { error: 'Taki użytkownik nie istnieje!' };
        if (user.username != request.user.nick)
            return { error: 'Nie możesz edytować tego użytkownika!' };
        let username = request.params.username;
        await User.findOneAndUpdate({
            username
        }, {
            listed,
            paste,
            lang,
        });
        return {reply: "Zmieniono użytkownik!", id}
    });

    fastify.delete('/:username', async function(request, reply){
        if (!request.user) return { error: 'Użytkownik niezalogowany!' };
        let post = await User.findOne({ username: request.params.username });
        if (post == null) return { error: 'Taki użytkownik nie istnieje!' };
        if (post.author != request.user.username)
            return { error: 'Nie możesz edytować tego użytkownik!' };
        let username = request.params.username;
        await User.findOneAndRemove({username});
        return {reply: "Usunięto użytkownika!"}
    })
};
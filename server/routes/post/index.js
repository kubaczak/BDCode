'use strict';

const Post = require('../../models/post.js');
const User = require('../../models/user.js');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  8
);

module.exports = async function (fastify, opts) {
  fastify.addHook('onRequest', (request) =>
    request.jwtVerify().catch(() => {
      console.log('Brak autoryzacji');
    })
  );

  fastify.get('/user/:username', async function (request, reply) {
    let username = request.params.username;
    const user = await User.findOne({ username });
    if (user == null) return { error: 'Taki użytkownik nie istnieje!' };
    let posts;
    let stars;
    if (request.user && request.user.nick == username) {
      posts = await Post.find({ author: user._id });
      stars = await Post.find({ starsUsers: user._id }, { id });
    } else {
      posts = await Post.find({ author: user._id, listed: true });
    }
    return { posts, stars };
  });

  fastify.post('/:id/star', async function (request) {
    if (!request.user) return { error: 'Użytkownik niezalogowany!' };
    let user = await User.findById(request.user.id);
    if (user == null) return { error: 'Taki użytkownik nie istnieje!' };
    let post = await Post.findOne({ id: request.params.id });
    if (post == null) return { error: 'Taki wpis nie istnieje!' };
    if (post.starsUsers.includes(request.user.nick))
      return { error: 'Obserwujesz już ten post!' };
    await post.update({
      stars: post.stars + 1,
      starsUsers: post.starsUsers.push(user._id),
    });
    return { reply: 'Obserwujesz post!' };
  });

  fastify.delete('/:id/star', async function (request) {
    if (!request.user) return { error: 'Użytkownik niezalogowany!' };
    let user = await User.findById(request.user.id);
    if (user == null) return { error: 'Taki użytkownik nie istnieje!' };
    let post = await Post.findOne({ id: request.params.id });
    if (post == null) return { error: 'Taki wpis nie istnieje!' };
    if (!post.starsUsers.includes(request.user.nick))
      return { error: 'Nie obserwujesz tego postu!' };
    for (let i = 0; i < post.starsUsers.length; i++) {
      if (post.starsUsers[i] == request.user.nick) {
        post.starsUsers.slice(i, 1);
      }
    }
    await post.update({
      stars: post.stars - 1,
      starsUsers: post.starsUsers,
    });
    return { reply: 'Obserwujesz post!' };
  });

  fastify.get('/:id', async function (request, reply) {
    let post = await Post.findOne({ id: request.params.id });
    if (post == null) return { error: 'Taki wpis nie istnieje!' };
    await Post.findOneAndUpdate(
      { id: request.params.id },
      { views: post.views + 1 }
    );
    let stars = [];
    for (let i in post.starsUsers) {
      let u = await User.findById(post.starsUsers[i].toString());
      stars.push(u.username ?? 'none');
    }
    let author = await User.findById(post.author);
    return {
      id: post.id,
      author: author.username,
      paste: post.paste,
      lang: post.lang,
      stars: post.stars,
      starsUsers: stars,
      views: post.views,
    };
  });

  fastify.post('/', async function (request, reply) {
    if (!request.body.paste) return { error: 'Uzypełnij brakujące dane!' };
    let id = nanoid();
    let listed = request.body.listed ? request.body.listed : true;
    let author = request.user ? request.user.id : process.env.ANONYMOUS_ID;
    let paste = request.body.paste;
    let lang = request.body.lang ? request.body.lang : 'text';
    let newPaste = new Post({
      id: id,
      listed: listed,
      author: author,
      paste: paste,
      lang: lang,
    });
    await newPaste.save();
    return { id };
  });

  fastify.put('/:id', async function (request, reply) {
    if (!request.user) return { error: 'Użytkownik niezalogowany!' };
    let post = await Post.findOne({ id: request.params.id });
    if (post == null) return { error: 'Taki wpis nie istnieje!' };
    if (post.author != request.user.id)
      return { error: 'Nie możesz edytować tego wpisu!' };
    if (!request.body.paste) return { error: 'Uzypełnij brakujące dane!' };
    let id = request.params.id;
    let listed = request.body.listed ? request.body.listed : true;
    let paste = request.body.paste;
    let lang = request.body.lang ? request.body.lang : 'text';
    await Post.findOneAndUpdate(
      {
        id,
      },
      {
        listed,
        paste,
        lang,
      }
    );
    return { reply: 'Zmieniono wpis!', id };
  });

  fastify.delete('/:id', async function (request, reply) {
    if (!request.user) return { error: 'Użytkownik niezalogowany!' };
    let post = await Post.findOne({ id: request.params.id });
    if (post == null) return { error: 'Taki wpis nie istnieje!' };
    if (post.author != request.user.id)
      return { error: 'Nie możesz edytować tego wpisu!' };
    let id = request.params.id;
    await Post.findOneAndRemove({ id });
    return { reply: 'Usunięto wpis!', id };
  });
};

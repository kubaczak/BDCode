'use strict';

const User = require('../../models/user.js');
const bcrypt = require('bcrypt');

module.exports = async function (fastify, opts) {
  fastify.addHook('onRequest', (request) =>
    request.jwtVerify().catch(() => {
      console.log('Brak autoryzacji');
    })
  );

  fastify.post('/register', async function (request, reply) {
    if (request.body.nick && request.body.email && request.body.password) {
      let { nick, email, password } = request.body;
      let re = /\S+@\S+\.\S+/;
      if (!re.test(email))
        return {
          error: 'Podany email jest w nieprawidłowym formacie!',
        };
      let findEmail = await User.findOne({ email: email });
      let findNick = await User.findOne({ username: nick });

      if (findEmail != null) return { error: 'Ten adres e-mail jest zajęty!' };
      if (findNick != null) return { error: 'Ten pseudonim jest zajęty!' };
      const newUser = new User({
        username: nick,
        email: email,
        password: password,
      });
      const salt = bcrypt.genSaltSync(10);
      newUser.password = bcrypt.hashSync(password, salt);
      await newUser.save();
      return { reply: 'Utworzono użytkownika pomyślnie!' };
    } else {
      return { error: 'Uzupełnij brakujące dane!' };
    }
  });

  fastify.post('/login', async function (request, reply) {
    if (request.user) return { error: 'Użytkownik zalogowany!' };
    if (!request.body.email || !request.body.password)
      return { error: 'Uzupełnij dane!' };
    let { email, password } = request.body;
    let find = await User.findOne({ email: email });
    if (find == null) return { error: 'Dane logowania nie zgadzają się!' };
    if (!bcrypt.compareSync(password, find.password))
      return { error: 'Dane logowania nie zgadzają się!' };
    const token = fastify.jwt.sign({
      nick: find.username,
      email: find.email,
      id: find._id,
    });
    let id = find._id;
    let username = find.username;
    email = find.email;
    reply
      .setCookie('token', token, {
        domain: 'localhost',
        path: '/',
        secure: false,
        httpOnly: true,
        sameSite: true,
      })
      .send({
        id,
        username,
        email,
      });
  });

  fastify.get('/', async function (request, reply) {
    if (request.user) return { reply: 'Użytkownik zalogowany' };
    return { reply: 'Użytkownik niezalogowany' };
  });
};

const expressSession = require('express-session');
const MongoStore = require('connect-mongodb-session')(expressSession);

const store = new MongoStore({
  uri: 'mongodb://admin:a_password!1@ds020208.mlab.com:20208/vue-music',
  collection: 'Sessions'
});

store.on('error', error => console.error('[SESSION ERROR]', error));

const session = expressSession({
  secret: 'd2J0=?+XSRk8Y5sp',
  cookie: {
    maxAage: 1000 * 60 * 60 * 24 * 7 // a week
  },
  store,
  resave: true,
  saveUninitialized: true
});

module.exports = session;

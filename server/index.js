const express = require('express');
const server = express();
const app = require('http').createServer(server);

server.use(express.static(__dirname + '/../client/dist/'))

const cors = require('cors');
var whitelist = ['http://localhost:8080', 'https://vusic.herokuapp.com/'];
var corsOptions = {
  origin: function(origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true
};
server.use(cors(corsOptions));
require('./db/db-config');

const bp = require('body-parser');
server.use(bp.json());
server.use(bp.urlencoded({ extended: true }));

// const Users = require('./models/user');
// server.get('/users', (req, res, next) => {
//   Users.find({})
//     .then(items => res.send(items))
//     .catch(next);
// });
// server.delete('/users/:id', (req, res, next) => {
//   Users.findByIdAndRemove(req.params.id)
//     .then(() => res.send({ message: 'Success' }))
//     .catch(next);
// });

const auth = require('./auth/routes');
server.use(auth.session);
server.use(auth.router);

server.use((req, res, next) => {
  if (!req.session.uid) {
    return res.status(401).send({ error: 'Please login to continue' });
  }
  next();
});

const routes = {
  songs: require('./routes/songs'),
  playlists: require('./routes/playlists')
};

server.use('/api/songs', routes.songs);
server.use('/api/playlists', routes.playlists);

server.use('/api/*', (error, req, res, next) => {
  res.status(400).send(error);
});
server.use('*', (req, res) =>
  res.status(404).send('<h1>404 NO PAGE HERE</h1>')
);

const port = process.env.PORT || 3002;
server.listen(port, () => console.log(`Server started on port: ${port}`));

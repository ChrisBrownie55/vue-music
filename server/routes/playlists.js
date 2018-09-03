const router = require('express').Router();
const Playlist = require('../models/playlist');
const PlaylistSongs = require('../models/playlist-song');

router.get('/', (req, res, next) =>
  Playlist.find({
    userId: req.session.uid
  })
    .then(items => res.send(items))
    .catch(next)
);

router.post('/', (req, res, next) =>
  Playlist.create({
    ...req.body,
    userId: req.session.uid
  })
    .then(item => res.send(item))
    .catch(next)
);

router.put('/:id', (req, res, next) =>
  Playlist.findOneAndUpdate(
    { _id: req.params.id, userId: req.session.uid },
    req.body
  )
    .then(() => res.send({ message: 'Successfully updated item.' }))
    .catch(next)
);

router.delete('/:id', (req, res, next) =>
  Playlist.findOneAndRemove({ _id: req.params.id, userId: req.session.uid })
    .then(() => res.send({ message: 'Successfully deleted item.' }))
    .catch(next)
);

router.post('/add-song', (req, res, next) => {
  Playlist.find({ _id: req.body.playlistId, userId: req.session.uid })
    .then(() =>
      PlaylistSongs.findOneAndUpdate(
        req.body,
        req.body,
        { upsert: true, new: true },
        (error, record) => {
          if (error) {
            return next(error);
          }
          res.send(record);
        }
      )
    )
    .catch(next);
});

router.delete('/delete-song/:playlistId/:songId', (req, res, next) => {
  Playlist.find({ _id: req.params.playlistId, userId: req.session.uid })
    .then(() =>
      PlaylistSongs.findOneAndRemove(
        {
          playlistId: req.params.playlistId,
          songId: req.params.songId
        },
        error => {
          if (error) {
            return next(error)
          }
          res.send({ message: 'Successfully deleted item.' });
        }
      )
    )
    .catch(next);
});

module.exports = router;

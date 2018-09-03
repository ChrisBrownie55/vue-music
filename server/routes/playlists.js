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
  Playlist.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.send({ message: 'Successfully updated item.' }))
    .catch(next)
);

router.delete('/:id', (req, res, next) =>
  Playlist.findByIdAndRemove(req.params.id)
    .then(() => res.send({ message: 'Successfully deleted item.' }))
    .catch(next)
);

router.post('/add-song', (req, res, next) => {
  Playlist.find({ _id: req.body.playlistId, userId: req.session.uid })
    .then(() =>
      PlaylistSongs.findOneAndUpdate(
        req.body,
        req.body,
        { upsert: true },
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

router.delete('/delete-song', (req, res, next) => {
  Playlist.find({ _id: req.body.playlistId, userId: req.session.uid })
    .then(() =>
      PlaylistSongs.findOneAndRemove(req.body, error => {
        if (error) {
          return res.status(400).send(error);
        }
        res.send({ message: 'Successfully deleted item.' });
      })
    )
    .catch(next);
});

module.exports = router;

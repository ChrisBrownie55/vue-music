const router = require('express').Router();
const Songs = require('../models/song');
const PlaylistSongs = require('../models/playlist-song');

router.get('/:playlistId', (req, res, next) =>
  PlaylistSongs.find({ playlistId: req.params.playlistId })
    .then(playlistSongs => {
      Songs.populate(
        playlistSongs,
        [{ path: 'songId' }],
        (error, playlistSongs) => {
          if (error) {
            next(error);
          }
          res.send(playlistSongs.map(playlistSong => playlistSong.songId));
        }
      );
    })
    .catch(next)
);

router.post('/', (req, res, next) =>
  Songs.create(req.body)
    .then(item => res.send(item))
    .catch(next)
);

// router.put('/:id', (req, res, next) =>
//   Songs.findByIdAndUpdate(req.params.id, req.body)
//     .then(() => res.send({ message: 'Successfully updated item.' }))
//     .catch(next)
// );

// router.delete('/:id', (req, res, next) =>
//   Songs.findByIdAndRemove(req.params.id)
//     .then(() => res.send({ message: 'Successfully deleted item.' }))
//     .catch(next)
// );

module.exports = router;

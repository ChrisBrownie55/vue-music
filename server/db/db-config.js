const mongoose = require('mongoose');
const { connection } = mongoose;
const connectionString = `mongodb://admin:a_password!1@ds020208.mlab.com:20208/vue-music`;

mongoose.connect(
  connectionString,
  { useNewUrlParser: true }
);

connection.once('open', () => console.log('Connected to database'));
connection.on('error', error => console.error(error));

const mongoose = require('mongoose');
const URI = 'mongodb://localhost/categories';
const config = {
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  };

mongoose.connect(URI,config)
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err));

module.exports = mongoose;

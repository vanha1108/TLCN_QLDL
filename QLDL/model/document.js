const mongoose = require('mongoose');
const doc = new mongoose.Schema({ filename: 'string', authorname: 'string', note: 'string', data: 'string' }, {collection: 'document'});
module.exports = mongoose.model('document', doc);
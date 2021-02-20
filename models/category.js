var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema(
  {
    name: {type: String, required: true, max:100},
    description: {type: String, required: true},
    image: {type: String, required: true}

})

//url virtual for category
CategorySchema
.virtual('url')
.get(function() {
  return '/directory/category/'  + this._id;
});

//Export model
module.exports = mongoose.model('Category',CategorySchema);

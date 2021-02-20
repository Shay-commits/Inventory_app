var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var ProductSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true}

})

// Virtual for product's url
ProductSchema
.virtual('url')
.get(function () {
  return '/directory/product/' + this._id;
});

//Export model
module.exports = mongoose.model('Product', ProductSchema);

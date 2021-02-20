var mongoose = require('mongoose');

var Schema = mongoose.Schema

var ProductinstanceSchema = new Schema (
  {
    product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
    size: {type: String, enum: ['S','M','L']},
    colour: {type: String, required: true},
    stock: {type: Number, required: true}



  }
)


// Virtua for Productinstance url
ProductinstanceSchema
.virtual('url')
.get(function() {
  return '/directory/productinstance/' + this._id;
});


//Export module

module.exports = mongoose.model('Productinstance', ProductinstanceSchema );

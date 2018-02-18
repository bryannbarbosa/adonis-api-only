'use strict'

const BaseModel = use('Model')
const mongoose = require('mongoose')
const Float = require('mongoose-float').loadType(mongoose, 2)
/**
 * @class Product
 */
class Product extends BaseModel {
  static boot ({ schema }) {
    schema.plugin(Float)
  }
  /**
   * Product's schema
   */
  static get schema () {
    return {
      _id: { type: String, default: mongoose.Types.ObjectId() },
      name: { type: String, required: true},
      image: { type: String, required: true},
      price: { type: Float, required: true},
      quantity: { type: Number, required: true}
    }
  }
}

module.exports = Product.buildModel('Product')

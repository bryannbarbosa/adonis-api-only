'use strict'

const BaseModel = use('Model')
const mongooseHidden = require('mongoose-hidden', )({ defaultHidden: { password: true }})
const uniqueValidator = require('mongoose-unique-validator')
const Product = use('App/Models/Product')


/**
 * @class User
 */
class User extends BaseModel {
  static boot ({ schema }) {
    schema.plugin(mongooseHidden)
    schema.plugin(uniqueValidator)
    this.addHook('preSave', 'UserHook.hashPassword')
  }
  /**
   * User's schema
   */
  static get schema () {
    return {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true, index: true },
      profile_pic: { type: String, required: true},
      password: { type: String, required: true },
      telephone: { type: String, required: true },
      type: { type: String, enum: ['root', 'dealer'], required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      products: [{ type: Product.schema }]
    }
  }

  static get primaryKey () {
    return '_id'
  }
}

module.exports = User.buildModel('User')

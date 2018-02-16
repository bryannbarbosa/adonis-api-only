'use strict'

const BaseModel = use('Model')
const mongooseHidden = require('mongoose-hidden', )({ defaultHidden: { password: true }})

/**
 * @class User
 */
class User extends BaseModel {
  static boot ({ schema }) {
    schema.plugin(mongooseHidden)
    this.addHook('preSave', 'UserHook.hashPassword')
  }
  /**
   * User's schema
   */
  static get schema () {
    return {
      name: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      type: { type:String, enum: ['root', 'dealer'], required: true },
      address: { type:String, required: true }
    }
  }

  static get primaryKey () {
    return '_id'
  }
}

module.exports = User.buildModel('User')

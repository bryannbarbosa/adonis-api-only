'use strict'

const Schema = use('Schema')

class CollectionSchema extends Schema {
  up () {
    this.collection('users', (collection) => {
      collection.index('email_index', {email: 1}, {unique: true})
    })
  }

  down () {
    this.drop('collections')
  }
}

module.exports = CollectionSchema

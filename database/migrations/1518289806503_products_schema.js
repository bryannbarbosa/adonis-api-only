'use strict'

const Schema = use('Schema')

class ProductsSchema extends Schema {
  up () {
    this.collection('products', (collection) => {
      collection.index('name_index', {name: 1}, {unique: true})
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductsSchema

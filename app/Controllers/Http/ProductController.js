'use strict'

const User = use('App/Models/User')
const Helpers = use('Helpers')

class ProductController {
  async index ({request, response}) {
    const user = await User.find({}).fetch()
    response.json({response: user, status: true})
  }

  async store ({request, response}) {
    if('name', 'image', 'price', 'quantity', 'user_id' in request.post()) {
      const body = request.only(['name', 'image', 'price', 'quantity'])
      const user = await User.where({_id: body.user_id}).first()
      
      if (user.user_type == 'administrator') {
        const image = request.file('image', {
        types: ['image'],
        size: '5mb'
      })

      const name = `${new Date().getTime()}.${image.subtype}`
    
      await image.move(Helpers.tmpPath('uploads'), {
        name: name
      })
    
      if(!image.moved()) {
        return image.error()
      }
      body.image = `${request.protocol()}://${request.hostname()}:3333/api/v1/upload/${name}`
      user.products.push(body)
      response.json({response: 'Product created', status: true, belongsTo: {name: user.name, 
      email: user.email}})
      }
      
      else {
        response.json({response: 'You don\'t have permission to store products'})
      }

    } else {
      response.json({response: 'name, image, price, quantity and user_id are required'})
    }
  }

  async show ({request, response, params}) {
    const { id } = params
    const knexQuery = knex('users')
    const mongoQuery = {products: id}
    mongoToKnex(mongoQuery, knexQuery);
    response.json({response: knexQuery, status: true})
  }

  async update ({request, response, params}) {
    
    const body = request.post()
    const { id } = params

    if(request.file('image')) {
      const image = request.file('image', {
        types: ['image'],
        size: '5mb'
      })
      const name = `${new Date().getTime()}.${image.subtype}`
      await image.move(Helpers.tmpPath('uploads'), {
        name: name
      })
      if(!image.moved()) {
        return image.error()
      }
      body.image = `${request.protocol()}://${request.hostname()}:3333/api/v1/upload/${name}`
    }

    await User.where({products: id}).update(body)
    const keys = Object.keys(body)
    response.json({response: 'Product has updated', status: true, updated_fields: keys})
  }

  async destroy ({request, response, params}) {
    const { id } = params
    const product = await User.find({products: id})
    await product.delete()
    response.json({response: 'Product has deleted', status: true})
  }
}

module.exports = ProductController

'use strict'

const Product = use('App/Models/Product');
const User = use('App/Models/User');
const Helpers = use('Helpers')

class ProductController {
  async index ({request, response}) {
    const product = await Product.all()
    response.json({response: product, status: true})
  }

  async store ({request, response}) {
    if('name', 'image', 'price', 'quantity', 'user_id' in request.post()) {
      const body = request.only(['name', 'image', 'price', 'quantity', 'user_id'])
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
      const product = new Product(body)
      await product.save()
      return {response: 'Product created', status: true, belongsTo: {name: user.name, email: user.email}}
      }
      
      else {
        response.json({response: 'You don\'t have permission to store products'})
      }
      

    } else {
      response.json({response: 'name, image, price, quantity and user_id are required'})
    }

    
  }

  async show () {
  }

  async update () {
  }

  async delete () {
  }
}

module.exports = ProductController

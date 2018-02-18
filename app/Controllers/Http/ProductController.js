'use strict'

const User = use('App/Models/User')
const Helpers = use('Helpers')

class ProductController {
  async index ({request, response}) {
    const products = await User.find({"products": {"$exists": true}}).select('products')
    response.json({response: products, status: true})
  }

  async store ({request, response}) {
    if('name', 'image', 'price', 'quantity', 'user_id' in request.post()) {
      const body = request.only(['name', 'image', 'price', 'quantity', 'user_id'])
      const id = body.user_id
      const user  = await User.findOne({_id: body.user_id})
      
      if (user.type == 'root') {
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
      delete body.user_id
      body.price = parseFloat(body.price)
      const exists = await User.find({"products.name": body.name}).select("products")
      if(exists.length >= 1) {
        response.json({
          response: 'This product already exists',
          status: false
        })
      } else {
        await User.findByIdAndUpdate(id, { $push: { products: body }})
        response.json({response: 'Product created', status: true, belongsTo: {name: user.name, 
          email: user.email}})
        }
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
    const product = await User.findOne({'products._id': id}).select("products")
    response.json({response: product, status: true})
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
    let query = {}
    for (let key in body) {
      let value = body[key]
      if(value.match(/^-{0,1}\d+$/)) {
        body[key] = parseInt(body[key])
      }
      if(value.match(/^\d+\.\d+$/)) {
        body[key] = parseFloat(body[key])
      }
      query['products.$.' + key] = body[key]
    }
    await User.update({'products._id': id}, {$set: query})
    const keys = Object.keys(body)
    response.json({response: 'Product has updated', status: true, updated_fields: keys})
  }

  async destroy ({request, response, params}) {
    const { id } = params
    await User.findOneAndUpdate({}, { $pull: { 'products': {"_id": id } } })
    response.json({response: 'Product has deleted', status: true})
  }

  async products({request, response, params}) {
    const { id } = params
    const products = await User.find({"_id": id, "products": {"$exists": true}}).select('products')
    response.json({
      response: products,
      status: true
    })
  }
}

module.exports = ProductController

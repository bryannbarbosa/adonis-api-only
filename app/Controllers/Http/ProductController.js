'use strict'

const User = use('App/Models/User')
const Helpers = use('Helpers')
const base64Img = require('base64-img');


class ProductController {
  async index ({request, response}) {
    const products = await User.find({"products": {"$exists": true}}).select('products')
    response.json({response: products, status: true})
  }

  async store ({request, response}) {
      const body = request.post()
      const id = body.user_id
      const user  = await User.findOne({_id: body.user_id})
      
      if (user.type == 'root') {
        const image = request.input('image')
        const image_name = `${new Date().getTime()}`
        body.image = `${request.protocol()}://${request.hostname()}:3333/uploads/${image_name}`
        await base64Img.img(image, Helpers.publicPath('uploads'), image_name, (err, filepath) => {
          if(err) {
            return err;
          }
        });
        let extension = image.match(/[a-z]+:[a-z]+\/[a-z]+/g)
        extension = extension[0].match(/[a-z]+/g)
        extension = extension[extension.length - 1]
        body.image += `.${extension}`
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
  }

  async show ({request, response, params}) {
    const { id } = params
    const product = await User.findOne({'products._id': id}).select("products")
    response.json({response: product, status: true})
  }

  async update ({request, response, params}) {
    
    const body = request.post()
    const { id } = params

    if(request.input('image')) {
      const image = request.input('image')
      const image_name = `${new Date().getTime()}`
      body.image = `${request.protocol()}://${request.hostname()}:3333/uploads/${image_name}`
      await base64Img.img(image, Helpers.publicPath('uploads'), image_name, (err, filepath) => {
        if(err) {
          return err;
        }
      });
      let extension = image.match(/[a-z]+:[a-z]+\/[a-z]+/g)
      extension = extension[0].match(/[a-z]+/g)
      extension = extension[extension.length - 1]
      body.image += `.${extension}`
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

  async search({request, response}) {
    const q = request.input('q').replace('+', ' ')
    let products = await User.findOne({'products.name': 'Produto de teste, para barba e bigode 3'}, {'products': {'$elemMatch': {'name': q}}})
    if(products.products.length == 0) {
      products = await await User.find({'products.name': q}, {'products': {'$elemMatch': {'$regex': `^w`, '$options:': 'i'}}})
    }
    response.json({
      response: products,
      status: true
    })
  }
}

module.exports = ProductController

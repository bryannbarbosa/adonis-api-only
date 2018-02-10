'use strict'

const Product = use('App/Models/Product');
const User = use('App/Models/User');
const Helpers = use('Helpers')

class ProductController {
  async index ({request, response}) {
    const product = Product.all()
    return {response: product, status: true}
  }

  async store ({request, response}) {
    const profilePic = request.file('profile_pic', {
      types: ['image'],
      size: '5mb'
    })
  
    await profilePic.move(Helpers.tmpPath('uploads'), {
      name: `${new Date().getTime()}.${profilePic.subtype}`
    })
  
    if(!profilePic.moved()) {
      return profilePic.error()
    }
    return {response: 'Product created', status: true}
  }

  async show () {
  }

  async update () {
  }

  async delete () {
  }
}

module.exports = ProductController

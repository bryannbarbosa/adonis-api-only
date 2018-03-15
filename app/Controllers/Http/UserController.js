'use strict'

const User = use('App/Models/User')
const Helpers = use('Helpers')
const base64Img = require('base64-img');

class UserController {
  async index ({request, response}) {
    const user = await User.find({})
    response.json({response: user, status: true})
  }

  async store ({request, response}) {
        let body = request.post()
        const image = request.input('profile_pic')
        const image_name = `${new Date().getTime()}`
        body.profile_pic = `${request.protocol()}://${request.hostname()}:3333/uploads/${image_name}`
        await base64Img.img(image, Helpers.publicPath('uploads'), image_name, (err, filepath) => {
          if(err) {
            return err;
          }
        });
        let extension = image.match(/[a-z]+:[a-z]+\/[a-z]+/g)
        extension = extension[0].match(/[a-z]+/g)
        extension = extension[extension.length - 1]
        body.profile_pic += `.${extension}`
        const user = new User(body)
        await user.save()
        response.json({response: 'User is created with success', status: true})
      
  }

  async show ({request, response, params}) {
    const { id } = params
    const user = await User.where({_id: id}).limit(1)
    response.json({response: user, status: true})
  }

  async update ({request, response, params}) {
    const body = request.post()
    const { id } = params
    await User.update({_id: id}, {$set: body})
    const keys = Object.keys(body)
    response.json({response: 'User has updated', status: true, updated_fields: keys})
  }

  async destroy ({request, response, params}) {
    const { id } = params
    const user = await User.find({_id: id}).limit(1).remove()
    response.json({response: 'User has deleted', status: true})
  }

  async auth({request, response, auth}) {
    const { email, password } = request.all()
    let token = await auth.attempt(email, password)
    let user = await User.find({email: email})
    return {response: token, user}
  }

  async products({request, response, params}) {
    const { id } = params
    const user = await User.find(id)
    const products = user.products
    response.json({response: products, status: true})
  }
}

module.exports = UserController

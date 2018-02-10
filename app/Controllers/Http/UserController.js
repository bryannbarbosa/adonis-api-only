'use strict'

const User = use('App/Models/User');

class UserController {
  async index ({request, response}) {
    const user = await User.all()
    response.json({response: user, status: true})
  }

  async store ({request, response}) {
    if('name', 'email', 'password', 'user_type', 'address' in request.post()) {
        const body = request.only(['name', 'email', 'password', 'user_type', 'address'])
        const user = new User(body)
        await user.save()
        response.json({response: 'User is created with success', status: true})
      } else {
       response.json({response: 'Name, email, password, address and user type are required', status: false})
      }
  }

  async show ({request, response, params}) {
    const { id } = params
    const user = await User.where({_id: id}).first()
    response.json({response: user, status: true})
  }

  async update ({request, response, params}) {
    const body = request.post()
    const { id } = params
    await User.where({_id: id}).update(body)
    const keys = Object.keys(body)
    response.json({response: 'User has updated', status: true, updated_fields: keys})
  }

  async destroy ({request, response, params}) {
    const { id } = params
    const user = await User.find(id)
    await user.delete()
    response.json({response: 'User has deleted', status: true})
  }

  async auth({request, response, auth}) {
    const { email, password } = request.all()
    return await auth.attempt(email, password)
  }

  async products({request, response, params}) {
    const { id } = params
    const user = await User.find(id)
    const products = user.products().fetch()
    response.json({response: products, status: true})
  }
}

module.exports = UserController

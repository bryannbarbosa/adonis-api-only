'use strict'

const User = use('App/Models/User');

class UserController {
  async index ({request, response}) {
    const user = await User.all()
    return {response: user, status: true}
  }

  async store ({request, response}) {
    if('name', 'email', 'password', 'user_type', 'address' in request.post()) {
        const body = request.only(['name', 'email', 'password', 'user_type', 'address'])
        const user = new User(body)
        await user.save()
        return {response: 'User is created with success', status: true}
      } else {
        return {response: 'Name, email, password, address and user type are required', status: false}
      }
  }

  async show ({request, response, params}) {
    const user = await User.where({_id: params.id}).first()
    return {response: user, status: true}
  }

  async update ({request, response, params}) {
    const body = request.post()
    await User.where({_id: params.id}).update(body)
    const keys = Object.keys(body)
    return {response: 'User has updated', status: true, updated_fields: keys}
  }

  async delete () {
  }
  async auth({request, response, auth}) {
    const { email, password } = request.all()
    return await auth.attempt(email, password)
  }
}

module.exports = UserController

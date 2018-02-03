'use strict'

const User = use('App/Models/User');

class UserController {
  async index ({request, response}) {
    const user = await User.all()
    response.json({response: user})
  }

  async create () {
  }

  async store ({request, response}) {
    if('name', 'email', 'password', 'user_type', 'address' in request.post()) {
        const body = request.only(['name', 'email', 'password', 'user_type', 'address'])
        const user = new User(body)
        await user.save()
        response.json({
          response: 'User is created with success',
          status: true
        })
      } else {
      response.json({
        response: 'Name, email, password, address and user type are required'
      })
    }
  }

  async show () {
  }

  async edit () {
  }

  async update () {
  }

  async delete () {
  }
  async auth({request, response, auth}) {
    const { email, password } = request.all()
    return await auth.attempt(email, password)
  }
}

module.exports = UserController

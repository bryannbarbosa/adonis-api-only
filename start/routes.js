'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route
  .group('users', () => {
    Route.resource('/users', 'UserController')
      .apiOnly()
    Route.post('/auth', 'UserController.auth')
  })
  .prefix('api/v1')
  .formats(['json'])

Route
  .group('products', () => {
    Route.resource('/products', 'ProductController')
      .apiOnly()
  })
  .prefix('api/v1')
  .formats(['json'])

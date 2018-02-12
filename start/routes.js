'use strict'

const Helpers = use('Helpers')

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
    Route.post('/jwt', 'UserController.jwt')
  })
  .prefix('api/v1')
  .formats(['json'])

Route
  .group('products', () => {
    Route.resource('/products', 'ProductController')
      .apiOnly()
    Route.get('/products/user/:id', 'ProductController.products')
  })
  .prefix('api/v1')
  .middleware('auth')
  .formats(['json'])

Route.get('upload/:fileId', async ({ params, response }) => {
  response.download(Helpers.tmpPath(`uploads/${params.fileId}`))
})
  .prefix('api/v1')
  .middleware('auth')
  .formats(['json'])

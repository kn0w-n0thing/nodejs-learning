'use strict'

const axios = require('axios')

const oauthPlugin = require('@fastify/oauth2')

module.exports = async function (fastify, opts) {
  const clientId = 'gateway'
  const clientSecret = 'rXtmKOshTzEvHIQnAsoX8r9VL0ZMlaKN'
  fastify.register(oauthPlugin, {
    name: 'keycloak',
    scope: ['openid', 'profile', 'email'],
    credentials: {
      client: {
        id: clientId,
        secret: clientSecret
      },
      auth: {
        authorizeHost: 'http://localhost:10222',
        authorizePath: '/realms/jcbc-test/protocol/openid-connect/auth',
        tokenHost: 'http://localhost:10222',
        tokenPath: '/realms/jcbc-test/protocol/openid-connect/token'
      }
    },
    // register a fastify url to start the redirect flow to the service provider's OAuth2 login
    startRedirectPath: '/auth/login',
    // service provider redirects here after user login
    callbackUri: 'http://localhost:3000/auth/callback'
    // You can also define callbackUri as a function that takes a FastifyRequest and returns a string
    // callbackUri: req => `${req.protocol}://${req.hostname}/login/facebook/callback`,
  })

  fastify.get('/auth/callback', async function (request, reply) {
    const { token } = await this.keycloak.getAccessTokenFromAuthorizationCodeFlow(request)

    // if later need to refresh the token this can be used
    // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)

    reply.send({ token })
  })

  fastify.get('/auth/logout', async function (request, reply) {
    const {id_token} = request.query

    const response = await axios.get(
        `http://localhost:10222/realms/jcbc-test/protocol/openid-connect/logout?id_token_hint=${encodeURIComponent(id_token)}&post_logout_redirect_uri=${encodeURIComponent('http://localhost:3000')}`)

    reply.send({status: response.status})
  })

  fastify.get('/', async function (request, reply) {
    return { root: true }
  })
}

'use strict'

const oauthPlugin = require('@fastify/oauth2')

module.exports = async function (fastify, opts) {
  fastify.register(oauthPlugin, {
    name: 'keycloak',
    scope: ['openid', 'profile', 'email'],
    credentials: {
      client: {
        id: 'gateway',
        secret: 'rXtmKOshTzEvHIQnAsoX8r9VL0ZMlaKN'
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
    console.log(`token: ${token}`)

    // if later need to refresh the token this can be used
    // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)

    reply.send({ token: token })
  })

  fastify.get('/', async function (request, reply) {
    return { root: true }
  })
}

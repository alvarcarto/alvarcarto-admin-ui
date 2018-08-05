const path = require('path')
const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request-promise')
const morgan = require('morgan')
const config = require('./config')

const app = express()
app.disable('x-powered-by')

// Trust 1 proxy hop because we are behind Heroku
app.set('trust proxy', 1)

app.use(morgan('dev'))

if (!config.ALLOW_HTTP) {
  app.use((req, res, next) => {
    if (req.secure) {
      return next()
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const err = new Error('HTTPS is required.')
      err.status = 403
      return next(err)
    }

    res.redirect(`https://${req.headers.host}${req.originalUrl}`)
  });
} else {
  console.warn('Warning, HTTPS is not enforced. DO NOT use this in production!')
}

if (!config.ALLOW_ACCESS_WITHOUT_KEY) {
  const validTokens = config.KEYS.split(',')
  app.use((req, res, next) => {
    const apiKey = req.headers['x-key'] || req.query.key;
    if (!_.includes(validTokens, apiKey)) {
      const err = new Error('Incorrect key.')
      err.status = 401
      return next(err)
    }

    return next();
  })
}

app.use(bodyParser.json())

app.get('/api/me', (req, res) => {
  res.json({
    name: req.headers['x-user-name'],
    email: req.headers['x-user-email'],
    photoUrl: req.headers['x-user-photo-url'],
  })
})

app.get('/api/promotions', (req, res) => {
  request({
    url: config.ALVAR_CARTO_ORDER_API_BASE_URL + '/api/promotions',
    headers: {
      'x-api-key': config.ALVAR_CARTO_ORDER_API_SECRET,
    },
    json: true,
  })
    .then((response) => {
      res.json(response)
    })
    .catch((err) => {
      console.error('Error', err)
      res.status(500)
      res.send(err)
    })
})

app.post('/api/promotions', (req, res) => {
  if (_.isString(req.body.description)) {
    req.body.description += ` Created by ${req.headers['x-user-email']}.`
  } else {
    req.body.description = `Created by ${req.headers['x-user-email']}.`
  }

  request({
    method: 'POST',
    url: config.ALVAR_CARTO_ORDER_API_BASE_URL + '/api/promotions',
    headers: {
      'x-api-key': config.ALVAR_CARTO_ORDER_API_SECRET,
    },
    body: req.body,
    json: true,
  })
    .then((response) => {
      console.log(`${req.headers['x-user-email']} created a new promotion ${req.body.promotionCode}`)
      res.json(response)
    })
    .catch((err) => {
      console.error('Error', err)
      res.status(500)
      res.send(err)
    })
})

app.use('/', express.static(path.join(__dirname, '../../build')))
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../../build/index.html')
  res.sendFile(indexPath)
})

app.listen(config.PORT, () => console.log(`Server running at http://localhost:${config.PORT}`))

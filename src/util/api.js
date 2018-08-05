import axios from 'axios'
import BPromise from 'bluebird'

export function getPromotion(code) {
  return BPromise.resolve(axios.get(`/api/promotions/${code}`))
}

export function getPromotions() {
  return BPromise.resolve(axios.get('/api/promotions'))
}

export function createPromotion(promotion) {
  return BPromise.resolve(axios.post('/api/promotions', promotion))
}

export function getMe() {
  return BPromise.resolve(axios.get('/api/me'))
}

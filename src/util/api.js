import axios from 'axios'

export function getPromotionCodes() {
  return axios.get('/api/promotions')
}

export function createNewPromotion(promotion) {
  return axios.post('/api/promotions', promotion)
}

export function getMe() {
  return axios.get('/api/me')
}

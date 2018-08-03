import axios from 'axios'

export function getPromotionCodes() {
  return axios.get('/api/promotions')
}

export function getMe() {
  return axios.get('/api/me')
}

import axios from 'axios'

export function getPromotionCodes() {
  return axios.get('/api/promotions')
}

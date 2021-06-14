import axios from 'axios'

let url = process.env.VUE_APP_API_DOMAIN

if (window.location.hostname.indexOf('localhost') === -1) {
  url = window.location.protocol + '//' + window.location.host + '/api/v1'
}

const http = axios.create({
  baseURL: url,
  withCredentials: true
})

export default http

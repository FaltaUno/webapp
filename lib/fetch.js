import fetch from 'isomorphic-unfetch'
import fetchDefaults from 'fetch-defaults'
import config from '../config'

export default fetchDefaults(fetch, config.api.uri, {
  // headers: {Authorization: "Bearer 42"}
})

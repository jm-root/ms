import client from './client'
import mdl from './core/mdl'

let $ = mdl(client)
$.client = client
export default $

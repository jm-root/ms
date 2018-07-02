import Fly from 'flyio/dist/npm/fly'
import fnclient from '../core/fnclient'

let fly = new Fly()
let client = fnclient(fly)

export default client

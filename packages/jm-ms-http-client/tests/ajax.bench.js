const mdl = require('../lib')
const MS = require('jm-ms-core')

const client = mdl.client

const http = require('http')
const fly = require('flyio')
const axios = require('axios')

const uri = 'http://localhost:3000/sso'

async function ajax_ms () {
  let $ = await client(uri)
  let doc = await $.request('/')
  return doc
}

function ajax_http () {
  return new Promise((resolve, reject) => {
    http
      .get(uri, (res) => {
        const {statusCode} = res
        const contentType = res.headers['content-type']

        let error
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' +
            `Status Code: ${statusCode}`)
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error('Invalid content-type.\n' +
            `Expected application/json but received ${contentType}`)
        }
        if (error) {
          console.error(error.message)
          // consume response data to free up memory
          res.resume()
          return reject(error)
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData)
            resolve(parsedData)
          } catch (e) {
            reject(e)
          }
        })
      })
      .on('error', (e) => {
        console.error(`Got error: ${e.message}`)
      })
  })

}

function ajax_fly () {
  return fly.get(uri)
}

function ajax_axios () {
  return axios.get(uri)
}

async function test (fn, name) {
  const t0 = Date.now()
  try {
    for (let i = 0; i < 1000; i++) {
      const doc = await fn()
      if (i === 0) console.log(doc.data || doc)
    }
  } catch (e) {
    console.log(e)
  }
  console.log(name, Date.now() - t0)
}

async function testAll () {
  await test(ajax_http, 'http')
  await test(ajax_ms, 'ms')
  await test(ajax_fly, 'fly')
  await test(ajax_axios, 'axios')
}

testAll()


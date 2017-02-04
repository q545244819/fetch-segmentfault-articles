const request = require('request')
const fs = require('fs-extra')
const cheerio = require('cheerio')
const async = require('async')

const config = fs.readJsonSync('./config.json')
const url = `https://segmentfault.com`
const articles = []

const getAllArticlesUrl = page => new Promise((resolve, reject) => {
  const get = (page, cb) => {
    const articlesOptions = {
      url: `${url}/u/${config.username}/articles?page=${page}`,
      headers: {
        Cookie: config.cookies
      }
    }

    request.get(articlesOptions, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        const $ = cheerio.load(body)
        const $el = $('ul.profile-mine__content')

        if (!$el.html()) {
          return typeof cb === 'function' ? cb() : ''
        }

        $el.find('.profile-mine__content--title').each((index, el) => {
          articles.push($(el).attr('href'))
        })

        get(page + 1, cb)
      }
    })
  }

  get(page, () => resolve())
})
const saveArticle = path => new Promise((resolve, reject) => {
  const articleOptions = {
    url: `${url}${path}/edit`,
    headers: {
      Cookie: config.cookies
    }
  }

  request.get(articleOptions, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      const $ = cheerio.load(body)
      const fileName = $('#myTitle').attr('value').replace(/\//g, '-')
      const createDate = $('input[name="created"]').attr('value').replace(/-/g, '/')
      const file = `./articles/${fileName}.md`
      const text = `title: ${fileName}\ndate: ${createDate}\npermalink: ${articleOptions.url}\n---\n\n${$('#myEditor').text()}`

      fs.outputFile(file, text, err => {
        if (err) {
          reject(err)
        } else {
          console.log(`保存 ${file} 成功！`)

          resolve(file)
        }
      })
    }
  })
})

getAllArticlesUrl(1)
  .then(() => {
    async.map(articles, saveArticle, (err, results) => {
      if (err) {
        throw err
      } else {
        console.log(results)
      }
    })
  })
  .catch(err => console.error(err))
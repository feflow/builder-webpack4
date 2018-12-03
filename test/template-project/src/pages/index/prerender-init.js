const indexPage = require('./index')
const fs = require('fs')

const html = indexPage.renderStaticHtml()
fs.writeFile('./prerender.html', html).then(res => {
    console.log('prerender success')
}).catch(err => {
    console.error(err)
})
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/greet/:name', (req, res) => {
    const {name} = req.params
    res.render('greet.ejs',{name: name})
})

app.get('/posts', (req, res) => {
    var posts = [
        { title: 'My Post', author: 'Peter' },
        { title: 'Future Daily', author: 'World' },
        { title: 'Dementia', author: 'WHO' },
    ]
    res.render('posts.ejs', {posts: posts})
})

app.listen(port, () => {
    console.log(`server is starting at port ${port}`)
})
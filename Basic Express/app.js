const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 8000
const axios = require('axios')
const friendList = ['example']

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')


app.get('/data', (req, res) => {
    console.log('kick')
    res.json({name: 'peter', age: 23})
})


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/greet/:name', (req, res) => {
    const {name} = req.params
    res.render('greet',{name: name})
})

app.get('/posts', (req, res) => {
    var posts = [
        { title: 'My Post', author: 'Peter' },
        { title: 'Future Daily', author: 'World' },
        { title: 'Dementia', author: 'WHO' },
    ]
    res.render('posts.ejs', {posts: posts})
})

app.get('/friends', (req, res) => {
    res.render('friend',{friends: friendList})
})

app.post('/friends', (req, res) => {
    const {friend} = req.body
    friendList.push(friend)
    res.redirect('/friends')
})

app.get('/movie/:name', async (req, res) => {
    const {name} = req.params
    let {data} =  await axios.get(`https://jsonplaceholder.typicode.com/${name}`)
    let view = ""
    data.forEach(element => {
        view += `<li>${element.title}</li>`
    });
    console.log(view)
    res.send(view)
})

app.listen(port,'127.0.0.1',() => {
    console.log(`server is starting at port ${port}`)
})
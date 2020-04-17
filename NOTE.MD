# Note throughout the lesson

## Route
every route will be listed by 
```sh 
app.get('\[route name\]', (req, res) => {
    res.send(\[the return response\])
}) 
```

you can use params by giving ':', for example : 
```sh 
app.get('greet/:name'), (req,res) => {
    const name = req.param.name
    res.send('hii ' + name)
}
```

never forget to make listen * at the very end of route. because the route reading by order. listen * was usefull to catch 404 request.

```sh 
app.get('*', (req, res) => {
    res.send('404 PAGE NOT FOUND')
})
```

## EJS

ejs was library in npm to install just neet to ``` npm i ejs --save ```. ejs was use to support embeed JS in html File.


### Basic printing

 EJS support templating just like laravel blade ``` {{ [variable/php syntax] }} ``` EJS was using ``` <%= [variable/ js syntax] %> ``` . the EJS file must have ``` .ejs ``` extension.


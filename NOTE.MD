# Note throughout the lesson


## Express app.js Configure
the thing we can configure in app.js within our apps

### Static File
To use a folder of static file like assets, css, html, or even js we need to let our apps know which folder that contain our asset. tpo include the folder we can do like this example syntax :
```sh
app.use(express.static('[name of the folder]'))
```

so later on we could call our file in ejs like usally by link. here is the example

```sh
<link rel="stylesheet/css" href="[file name]"/>
```

### Set View Engine in our express
we can set our view engine within the app so we dont need to set write our file extension when render. all we need is this chunck of code

```sh
app.set('view engine','[view engine name (in this case : "ejs")]')
```

### Route
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

### Rendering
if you want to return html, you can have a greet help by using ejs. the way to return response is by ``` res.render('[filename].ejs') ``` the render function will find the file wihtin the ```views/``` folder. example :

```sh
app.get('/', (req, res) => {
    res.render('greet.ejs')
})
```

But if you already set the ```view Engine``` you can exculde the file extension ```.ejs``` become like this

```sh
app.get('/', (req, res) => {
    res.render('greet')
})
```

## EJS

ejs was library in npm to install just neet to ``` npm i ejs --save ```. ejs was use to support embeed JS when rendering html file. it works like blade in laravel


### Basic printing

 EJS support templating just like laravel blade ``` {{ [variable/php syntax] }} ``` EJS was using ``` <%= [variable/ js syntax] %> ``` . the EJS file must have ``` .ejs ``` extension.

 ### Conditonal Rendering

 EJS support to embed javascript ```if``` to the ejs. it's the same as printing but remeber to delete the ```=``` sign. and produce like this example :

 ```sh
<% if(*arguments*) { %>
    <p>true</p>
<% } else { %>
    <p>false</p>
<% } %>
 ```

 ### looping

 Just like usual looping in javascript we can user ```for ``` loop or ```forEach```. the syntax at ejs was quite the same like conditional. example :

```sh
<% posts.forEach( item => {%>
    <li>
        <%= item.title %> - 
        <strong>
            <%= item.author %>
        </strong>
    </li>
<% }) %>
 ```

 ### Extending Template

 Just the same as Blade ```@section``` . it work to extending the other template so we don't need to copy paste the same content for every view like ```header``` or ```footer```

 ```sh
 <%- include('filepath/filename.extension') %>
 ```


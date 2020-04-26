## Weird Stuff

how to make an clean object (no null or undefined attribute and no redudancy on data)

```js
let data = null
let data2 = 'weird stuff'

const a = {
...(!!data && {data}),
...(!!data2 && {data2})
}
console.log(a) // return {data2: "weird stuff"}

data = 'actually good'
data2 = 'weird stuff'

const b = {
...(!!data && {data}),
...(!!data2 && {data})
}

console.log(b) // return {data: "actually good"}

const c = {
...(!!data && {data}),
...(!!data && {data2})
}

console.log(c) // return {data: "actually good", data2: "wierd stuff"}
```
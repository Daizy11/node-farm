const fs = require("fs")
const http = require('http')
const url = require('url')
const replaceTemplate= require('./module/replaceTemplate.js')
const slugify = require('slugify')

////Files

//Blocking code (Syncronous )
// const textIn = fs.readFileSync("./txt/input.txt",'UTF-8')
// console.log(textIn)
// const textOut = `This was we know about avocado: ${textIn}.\n Created:${Date.now()}`
// fs.writeFileSync('./txt/output.txt',textOut)
// console.log("File Written..")

//Non Blocking Code Asyncronus
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//       if (err) return console.log('ERROR! 💥');
    
//       fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//           console.log(data3);
    
//           fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//             console.log('Your file has been written 😁');
//           })
//         });
//       });
//     });
//     console.log('Will read file!');

////Server

//top level code only get execute once right in the beginning(when start the program)

const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8')


const data = fs.readFileSync(`${__dirname}/data.json`,'utf-8')
const dataObj = JSON.parse(data)

const slug = dataObj.map(el => slugify(el.productName,{lower:true}))
console.log(slug)

//callback function execute each time that there is a new request 
const server = http.createServer((req,res)=>{
    const {query,pathname} = url.parse(req.url,true)

   //overview page
   if(pathname == "/" || pathname == "/overview"){
    res.writeHead(200,{'Content-type': 'text/html'})
    
    //map() creates a new array from calling a function for every array element.
    const cardHtml = dataObj.map(el =>replaceTemplate(tempCard,el))
    const output = tempOverview.replace( '{%PRODUCT_CARD%}',cardHtml)
    res.end(output)
   }

   //product page
   else if(pathname=="/product"){
       res.writeHead(200,{'Content-type': 'text/html'})
    const product = dataObj[query.id]
    const output = replaceTemplate(tempProduct,product)
    res.end(output)
   }

   //api page
   else if(pathname=="/api"){
    // fs.readFile(`${__dirname}/data.json`,'utf-8',(err,data)=>{
    //    const productData =  JSON.parse(data)
       res.writeHead(200,{'Content-type': 'application/json'})
       res.end(data)
  //  })
   }

   //not found page 
   else {
    res.writeHead(404,{
        'Content-type': 'text/html',
        'my-own-header': 'hello world'
    })
    res.end('<h1>Page Not Found </h1>')
   }
})

server.listen(3000,'127.0.0.1',()=>{
console.log("Server nyala di port 3000 Boi")
})
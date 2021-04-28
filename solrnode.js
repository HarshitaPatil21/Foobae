var SolrNode = require('solr-node');
const path =require('path')
const express = require('express');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const app = express()
const port = process.env.PORT || 8001
app.set("view engine","ejs")
const staticpath=path.join(__dirname)
app.use(express.static(staticpath));

app.use(express.urlencoded({extended:true}))
app.use(express.json())
var realprice;
var realsuit;
var realcat;
var realdata;
var t;
app.get('/', (req, res) => {
   res.sendFile(__dirname + '/frontbae.html');
  //res.send(data);
  
})

app.post('/results', function(req, res){
   // req.body object has your form values
    realprice=req.body.price;
    realsuit=req.body.suit;

    realcat=req.body.Cat;
    var client = new SolrNode({
      host: 'foobae.azurewebsites.net',
      port: '80',
      core: 'foobae_db',
      protocol: 'http'
  });
  require('log4js').getLogger('solr-node').level = 'DEBUG';
  var realtype_compare
  if(realcat=='Non-veg')
  realtype_compare=0;
  else
  realtype_compare=1;

  
  var strQuery = client.query().q({type_compare:realtype_compare,price_compare:realprice,suitability:realsuit});
  
   
  client.search(strQuery, function (err, result) {
     if (err) {
        console.log(err);
        return;
     }
    // data=result.response.docs[0].type1.toString();
    realdata=result.response;
    t=realdata.numFound;
    
    console.log(realdata);
    console.log(realdata.docs[0].photos[0])
    
     
  });
   
 
  res.redirect('/results')
   });
// Create client

 





app.get('/results', (req, res) => {
   res.render('index',{
      
      data:realdata,
      n:t,
    
   });
  //res.send(data);
  
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const needle=require("needle")
const Binance = require('binance-api-node').default
require("dotenv").config()
const colors=require("colors")
const TOKEN =process.env.TOKEN
const rulesURL="https://api.twitter.com/2/tweets/search/stream/rules"
const streamURL="https://api.twitter.com/2/tweets/search/stream?expansions=author_id"

const uri=process.env.MONGO_URL
const { MongoClient } = require("mongodb");
var express = require('express');
const { json } = require("express")
  var app     = express();
 
  app.set('port', (process.env.PORT || 4002));

  //For avoidong Heroku $PORT error
  app.get('/', function(request, response) {
      var result = 'App is running'
      response.send(result);
  }).listen(app.get('port'), function() {
      console.log('App is running, server is listening on port ', app.get('port'));
  });
//-----------------------------------------------------------------

async function findMany(acc, array) {
	const client = new MongoClient(uri);
	try {
	  const database = client.db("myDatabase");
	  const movies = database.collection("recipes");
	  // Query for a movie that has the title 'The Room'
	  const query = { twitterAcc: acc };
	  const movie = await movies.find(query);
	  await movie.forEach(element => array.push(element));

	  // since this method returns the matched document, not a cursor, print it directly
	  //return (arrayMovie);
	} finally {
	  await client.close();
	}
  } 

const getRequest = async (id, text) => {
    let endpointURL = `https://api.twitter.com/2/users?ids=${id}`
    // These are the parameters for the API request
    // specify User names to fetch, and any additional fields that are required
    // by default, only the User ID, name and user name are returned
    // this is the HTTP header that adds bearer token authentication
    const res = await needle('get', endpointURL, {
        headers: {
            "User-Agent": "v2UserLookupJS",
            "authorization": `Bearer ${TOKEN}`
        }
    })

    if (res.body) {
        const x = res.body.data[0]?.username

        let accArr = []
        await findMany(x,accArr)
        findAccCoin(accArr,text)
    } else {
        throw new Error('Unsuccessful request')
    }
}

  const binanceNewOrder = async (obj,coin) => {

    let client = Binance({
        apiKey: obj.BinanceSecretkey,
        apiSecret: obj.Binancekey
      })
    
    coin = coin.toUpperCase()

    var chars = {'İ':'I', 'Ü':'U', 'Ç':'C', 'Ö':'O', 'Ş':'S'};
    coin = coin.replace(/[İÜÇÖŞ]/g, m=>chars[m])

    coin += "USDT"
    console.log("coin: ",coin);
/*
    const orderX = await client.order({
        symbol: coin,
        side: 'BUY',
        type: 'MARKET',
        quoteOrderQty: obj.money,
    })  */
  }
  
   const findAccCoin = async (accArr, text) =>{
    try {

        accArr.map((obj) => {

            if(text.search(obj.tweetStr) != -1){
                console.log("tweet str uygun: ",obj.name);
                obj.coin.map((cn) =>{
                    if(text.search(cn) != -1){
                        console.log(obj.name," işlemi yapıcak");
                        binanceNewOrder(obj,cn)
                    }
                    
                })
            }

        })
        console.log("text: ", text);

    } catch (error) {
        console.log(error);
    }
}


async function getRules(){
    const response= await needle('get',rulesURL,{
        headers:{
            Authorization: `Bearer ${TOKEN}`
        }
    })
   
    return response.body
}
async function setRules(rule){
    const data={
        add: rule
    }
    const response= await needle('post',rulesURL,data,{
        headers:{
            'content-type':'application/json',
            Authorization: `Bearer ${TOKEN}`
        }
    })
    
    return response.body
}
async function deleteRules(rules){
    if(!Array.isArray(rules.data)){
        return null
    }
    const ids=rules.data.map((rule=>{
        return rule.id
    }))
    
    const data={
        delete: {
            ids:ids
        }
    }
    const response= await needle('post',rulesURL,data,{
        headers:{
            'content-type':'application/json',
            Authorization: `Bearer ${TOKEN}`
        }
    })
    console.log("delete rules:", response.body);
    return response.body
}

async function streamTweets(){
    console.log("Stream started".green)
    const stream=needle.get(streamURL,{
        headers:{
            Authorization: `Bearer ${TOKEN}`
        }
    })
    let id;
    stream.on("data",(data)=>{
        try{
            const json=JSON.parse(data)
            id = json.data.author_id
            text = json.data.text
            console.log("asd: ",json.data.text);
            getRequest(id, text)
            
            
        }catch(error){
            console.log(error);
        }
    })


}
const main = async (rule)=>{
    let currentrules

    const rules = [{"value": rule}]
    try{
        
        currentrules=await getRules()
        await deleteRules(currentrules)
        await setRules(rules)
        currentrules=await getRules()

    }
    catch(error){
        console.error(error)
        process.exit(1)
    }
    await streamTweets()
}
module.exports = {main}
// MERN = Mongo + Express + React + Node

// Development = Node.js server + React server

// MEN

// E - Express

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {main} = require('./helper/bot.js')

app.use(cors())
app.use(express.json())


let twitterAccArr = new Set()

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri=process.env.MONGO_URL

async function run() {
  try {
	
    const database = client.db('myDatabase');
    const movies = database.collection('recipes');
   
    const query = { name: 'loco moco' };
    const movie = await movies.findOne(query);
    console.log("look: ",movie);
  } finally {
    await client.close();
  }
}


async function insert(nam, mail, pass) {
	const client = new MongoClient(uri);
	try {
	  const database = client.db("myDatabase");
	  const haiku = database.collection("recipes");
	  
	  const doc = new User({
		name: nam,
		email: mail,
		password: pass,
	  })
	  const result = await haiku.insertOne(doc);
	  console.log(`A document was inserted with the _id: ${result.insertedId}`);
	} finally {
	  await client.close();
	}
  }


  async function find(mail) {
	const client = new MongoClient(uri);
	try {
	  const database = client.db("myDatabase");
	  const movies = database.collection("recipes");
	  
	  const query = { email: mail };
	  const movie = await movies.findOne(query);
	  return (movie);
	} finally {
	  await client.close();
	}
  }

  async function findToplu(array) {
	const client = new MongoClient(uri);
	try {
	  const database = client.db("myDatabase");
	  const movies = database.collection("recipes");
	  
	  
	  const movie = await movies.find();
	  await movie.forEach(element => array.push(element));

	} finally {
	  await client.close();
	}
  }  
  
  async function update(mail, Binancekey, BinanceSecretkey, twitterAcc, money, tweetStr, coin) {
	const client = new MongoClient(uri);	
	try {
	  const database = client.db("myDatabase");
	  const movies = database.collection("recipes");

	  const filter = { email: mail };

	  const updateDoc = {
		$set: {
			Binancekey: Binancekey,
			BinanceSecretkey: BinanceSecretkey,
			twitterAcc: twitterAcc,
			money: money,
			tweetStr: tweetStr,
			coin: coin
		},
	  };
	  const result = await movies.updateOne(filter, updateDoc);
	  console.log(
		`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
	  );
	} finally {
	  await client.close();
	}
  }




app.post('/api/register', async (req, res) => {
	console.log(req.body)
	try {
		const newPassword = await bcrypt.hash(req.body.password, 10)
		
		const isThereEmail = find(req.body.email)
		if(isThereEmail != null){
			throw "duplicate email"
		}else{
			insert(req.body.name,req.body.email,newPassword)
			res.json({ status: 'ok' })
		}
	} catch (err) {
		res.json({ status: 'error', error: err })
	}
})

app.post('/api/login', async (req, res) => {
	const user = await find(req.body.email)

	if (!user) {
		return { status: 'error', error: 'Invalid login' }
	}
	console.log("user: ",user)
	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			process.env.SECRET
		)

		return res.json({ status: 'ok', user: token })
	} else {
		return res.json({ status: 'error', user: false })
	}
})

app.get('/api/quote', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, process.env.SECRET)
		const email = decoded.email
		const user = await find(email)
		return res.json({ status: 'ok', Binancekey: user.Binancekey, BinanceSecretkey: user.BinanceSecretkey,
		twitterAcc: user.twitterAcc, money: user.money, tweetStr: user.tweetStr, coin: user.coin
	 })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.post('/api/quote', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, process.env.SECRET)
		const email = decoded.email
		await update(email,req.body.Binancekey, req.body.BinanceSecretkey, req.body.twitterAcc,
			 req.body.money, req.body.tweetStr, req.body.coin)	
		return res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.post('/api/bot', async (req, res) =>{
	
	let tAccArr = []
	try {
		console.log("body: ", req.body);
		await findToplu(tAccArr)
		console.log("sa");
		let tAccStr="("
		let arrAcc =[]
		tAccArr.map(obj =>{

			obj.twitterAcc.map(coin =>{
				arrAcc.push(coin)
			})
		})
		let uniqueArrAcc = [...new Set(arrAcc)];
		
		uniqueArrAcc.map((rank, i, arr) =>{
			if(arr.length - 1 === i){ 
				tAccStr += "from:"
				tAccStr += rank
				tAccStr += ")"					

			}else{
				tAccStr += "from:"
				tAccStr += rank
				tAccStr += " OR "	
			}
		})
		console.log("twitter account string: ", tAccStr);
		main(tAccStr)

	} catch (error) {
		
	}
	

})

app.listen(1337, () => {
	console.log('Server started on 1337')
})

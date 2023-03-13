const mongoose = require('mongoose')

const User = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		Binancekey: { type: String },
		BinanceSecretkey: { type: String },
		twitterAcc: { type: Array },
		money: { type: Number },
		tweetStr: { type: String },
		coin: { type: Array },
	},
	{ collection: 'user-data' }
)

const model = mongoose.model('UserData', User)

module.exports = model

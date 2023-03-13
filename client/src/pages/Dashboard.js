import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useNavigate } from 'react-router-dom'
import List from "./component/component"

const Dashboard = () => {
	const navigate = useNavigate()
	const [Binancekey, setBinancekey] = useState('')
	const [BinanceSecretkey, setBinanceSecretkey] = useState('')
	const [twitterAcc, setTwitterAcc] = useState('')
	const [twitterAccArr, setTwitterAccArr] = useState([])
	const [money, setMoney] = useState(0)
	const [tweetStr, setTweetStr] = useState('')
	const [coin, setCoin] = useState('')
	const [coinArr, setCoinArr] = useState([])

	const [text, setText] = useState("set bot")

	async function populateQuote() {
		const res = await fetch('http://localhost:1337/api/quote', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const data = await res.json()
		//console.log("token: ",localStorage.getItem('token'));
		if (data.status === 'ok') {
			setBinancekey(data.Binancekey)
			setBinanceSecretkey(data.BinanceSecretkey)
			setTwitterAccArr(data.twitterAcc)
			setMoney(data.money)
			setTweetStr(data.tweetStr)
			setCoinArr(data.coin)
		} else {
			alert(data.error)
		}
	}

	function handlesubmit(e) {
		e.preventDefault();
		setText("successful")
		setTimeout(() => {
			setText("set bot")
		}, 1500);


	}

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				navigate('/login', { replace: true })
			} else {
				populateQuote()
			}
		}
	}, [])

	async function updateQuote(event) {
		event.preventDefault()

		const req = await fetch('http://localhost:1337/api/quote', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				Binancekey: Binancekey,
				BinanceSecretkey: BinanceSecretkey,
				twitterAcc: twitterAccArr,
				money: money,
				tweetStr: tweetStr,
				coin: coinArr
			}),
		})
		setText("successful")
		setTimeout(() => {
			setText("set bot")
		}, 1500);

	}
	async function startBot(event) {
		event.preventDefault()

		const req = await fetch('http://localhost:1337/api/bot', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				Binancekey: Binancekey,
				BinanceSecretkey: BinanceSecretkey,
				twitterAcc: twitterAccArr,
				money: money,
				tweetStr: tweetStr,
				coin: coinArr
			}),
		})
	}

	const trashAccount = (removeItem) => {
		setTwitterAccArr(twitterAccArr.filter(item => item !== removeItem))
	}
	const trashCoin = (removeItem) => {
		setCoinArr(coinArr.filter(item => item !== removeItem))
	}

	function pushTwitterArr(event) {
		event.preventDefault()
		setTwitterAccArr(oldArray => [...oldArray, twitterAcc])
		setTwitterAcc("")
	}
	function pushCoinArr(event) {
		event.preventDefault()
		setCoinArr(oldArray => [...oldArray, coin])
		setCoin("")
	}

	return (


		<body>
			<div className="div-scroll">
				<form onSubmit={pushTwitterArr} >
					<input className='input-dash'
						type="text"
						placeholder="twitter account(s)"
						value={twitterAcc}
						onChange={(e) => setTwitterAcc(e.target.value)} />
					<button className='dash-btn'>add account</button>
				</form>

				<div>{twitterAccArr?.map(entry =>
					<List key={entry} content={entry} trash={trashAccount} />
				)}
				</div>
			</div>

			<div className="div-scroll">
				<form onSubmit={pushCoinArr} >
					<input className='input-dash'
						type="text"
						placeholder="coin(s) to buy "
						value={coin}
						onChange={(e) => setCoin(e.target.value)} />
					<button className='dash-btn'>add coin</button>
				</form>
				<div>{coinArr?.map(entry =>
					<List key={entry} content={entry} trash={trashCoin} />
				)}
				</div>
			</div>


			<div className='other-div'>
				<form onSubmit={updateQuote} className='other-form other-form-key'>

					<input className='input-dash-other'
						type="text"
						placeholder="Binance Key"
						value={Binancekey}
						onChange={(e) => setBinancekey(e.target.value)}
					/>
					<input className='input-dash-other'
						type="text"
						placeholder="Binance Secret Key"
						value={BinanceSecretkey}
						onChange={(e) => setBinanceSecretkey(e.target.value)} />
				</form>

				<form onSubmit={updateQuote} className='other-form'>

					<input className='input-dash-other'
						type="number"
						placeholder="purchase amount"
						value={money}
						onChange={(e) => setMoney(e.target.value)} />

					<input className='input-dash-other'
						type="text"
						placeholder="twitter match string"
						value={tweetStr}
						onChange={(e) => setTweetStr(e.target.value)} />

					<input type="submit" value={text} className='submit-dash' />
				</form>
				<button onClick={startBot} className='button-87'>RUN BOT</button>
			</div>





		</body>

	)
}

export default Dashboard

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"

function App() {
	const navigate = useNavigate()

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(false)

	async function registerUser(event) {
		event.preventDefault()
		const response = await fetch('http://localhost:1337/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				email,
				password,
			}),
		})

		const data = await response.json()

		if (data.status === 'ok') {
			navigate('/login')
		} else {
			setError(true)
			setTimeout(() => {
				setError(false)
			}, 1500);
		}
	}

	return (
		<>

			<div className='divdiv'>

				<nav className='reg-log-nav'>
					<ul className='reg-log-ul'>
						<Link to="/">
							<li className='reg-log-li'>Home</li>
						</Link>

					</ul>
				</nav>
				<div className='empty'> </div>

				<div className='regdiv'>
					<h1 className='title'>Create your account</h1>
					<form onSubmit={registerUser} className='form'>
						<input className='input-reg-log'
							value={name}
							onChange={(e) => setName(e.target.value)}
							type="text"
							placeholder="Name"
						/>
						<br />
						<input className='input-reg-log'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							type="email"
							placeholder="Email"
						/>
						<br />
						<input className='input-reg-log'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type="password"
							placeholder="Password"
						/>
						<br />
						<input type="submit" value="Register" className='submit-log-reg' />
					</form>
					{error && <div className='errordiv'><h4 className='error'> has been used</h4></div>}

				</div>


			</div>
		</>
	)
}

export default App

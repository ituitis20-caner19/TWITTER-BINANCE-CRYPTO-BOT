import { useState } from 'react'
import { useNavigate  } from 'react-router-dom'
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom"
function App() {
	const navigate = useNavigate ()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	async function loginUser(event) {
		event.preventDefault()

		const response = await fetch('http://localhost:1337/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})

		const data = await response.json()
		
		if (data.user) {
			localStorage.setItem('token', data.user)
			alert('Login successful')
			navigate('/dashboard')
			
		} else {
			alert('Please check your username and password')
		}
	}

	return (
		<div className='divdiv'>

		<nav className='reg-log-nav'>
				<ul className='reg-log-ul'>
					<Link to="/">
						<li className='reg-log-li'>Home</li>
					</Link>

				</ul>
		</nav>			
		<div className='empty'> </div>

		<div className='logdiv'>
			<h1 className='title'>Log in</h1>
			<form onSubmit={loginUser} className='form'>
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
				<input type="submit" value="Login" className='submit-log-reg'/>
			</form>
		</div>
		</div>
	)
}

export default App

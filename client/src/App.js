import React from 'react'
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom"	
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Info from './pages/Info'
import Home from './pages/Home'


const App = () => {
	return (
		<div>
			<Router>
				<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/info" element={<Info />} />
				</Routes>

			</Router>
		</div>
	)
}

export default App

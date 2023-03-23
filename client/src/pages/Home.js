import { useState } from 'react'
import { useNavigate  } from 'react-router-dom'
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom"
import Background from './images/btnw-last.png'


function Home(){

    return(
		<>
		<div style={{ 
      backgroundImage: `url(${Background})`
    }}>
		<nav>
				<ul >
					<Link  to="/login">
						<li className='login'>Login</li>
					</Link>

					<Link to="/register">
						<li className='register'>Get started</li>
					</Link>
					<Link to="/info">
						<li className='login'>How to use</li>
					</Link>

				</ul>

		</nav>
		<a href='https://loginxnsywnf.auth.eu-north-1.amazoncognito.com' style={{color: "red"}}>LOGIN-LINK</a>
		</div>
		</>

	)
}

export default Home

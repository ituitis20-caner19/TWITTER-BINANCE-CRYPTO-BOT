import { useState } from 'react'
import { useNavigate  } from 'react-router-dom'
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom"
import image from "./images/aciklama-bot.png"

function Info(){


    return(
        <>
            <nav className='reg-log-nav'>
				<ul className='reg-log-ul'>
					<Link to="/">
						<li className='reg-log-li'>Home</li>
					</Link>

				</ul>
		    </nav>

        <div className='img-div'>
            <img src={image} width="90%" className='center-img'/>
        </div>
        <h1>1</h1>

        </>
    )
}
export default Info
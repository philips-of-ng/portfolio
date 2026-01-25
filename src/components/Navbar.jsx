import React, { useEffect, useRef, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import '../css/navbar.css'
import userImage from '../assets/images/hyper.svg'


const Navbar = () => {

  const philips_resume = 'https://drive.google.com/uc?export=download&id=11cdfkv-oAgIexll2jm70WEo7FHVrKGqh'
  

  const location = useLocation()

  const closeOcv = () => setOcvState('closed')

  useEffect(() => {
    closeOcv()
  }, [location])

  const [ocvState, setOcvState] = useState(`closed`)
  const ocvRef = useRef()

  const handleOcv = () => {
    if (ocvState === 'closed') {
      setOcvState('animate__fadeInDown activate-ocv')
    } else {
      setOcvState('animate__fadeOutUp closed')

      setTimeout(() => {
        setOcvState('closed')
      }, 100);
    }
  }

  

  return (
    <header>
      <nav>
        <div className="dp">
          <Link to="/">
            <img src={ userImage } alt="" />
          </Link>
        </div>

        <div className="the-nav">
          <ul>
            <li><Link to="/" className={`nav-link ${ location.pathname == '/' || location.pathname == '/home' ? "active-nav-link" :  '' }`}>Home</Link></li>
            <li><Link to="/about-me" className={`nav-link ${ location.pathname == '/about-me' || location.pathname == '/book-a-call' ? "active-nav-link" : '' }`}>About Me</Link></li>
            <li><Link to="/projects" className={`nav-link ${ location.pathname == '/projects' || location.pathname.startsWith('/projects') ? "active-nav-link" : '' }`}>Projects</Link></li>
            <li><Link to="/tools" className={`nav-link ${ location.pathname == '/tools' ? "active-nav-link" : '' }`}>Tools</Link></li>
          </ul>
        </div>

        <div className="download-cv">
          <a href={ philips_resume } >Download CV</a>
        </div>


        <div className="ocv-btn-div">
          <div className="download-cv-2">
            <a href={ philips_resume }>Download CV</a>
          </div>

          <button id="ocv-button" className="ocv-button" onClick={handleOcv}>
            <i id="ocv-icon" className={`bx ${ocvState === 'closed' ? 'bx-menu' : 'bx-x'}`}></i>
          </button>
        </div>
      </nav>

      <div className={`off-canvas animate__animated ${ocvState}`} id="off-canvas" ref={ocvRef}>
        <div className="the-ocv-nav">
        <ul>
            <li><Link to="/" className={`nav-link ${ location.pathname == '/' || location.pathname == '/home' ? "active-nav-link" :  '' }`}>Home</Link></li>
            <li><Link to="/about-me" className={`nav-link ${ location.pathname == '/about-me' || location.pathname == '/book-a-call' ? "active-nav-link" : '' }`}>About Me</Link></li>
            <li><Link to="/projects" className={`nav-link ${ location.pathname == '/projects' || location.pathname.startsWith('/projects') ? "active-nav-link" : '' }`}>Projects</Link></li>
            <li><Link to="/tools" className={`nav-link ${ location.pathname == '/tools' ? "active-nav-link" : '' }`}>Tools</Link></li>
          </ul>
        </div>
      </div>

    </header>
  )
}

export default Navbar
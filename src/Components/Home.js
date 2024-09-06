import React from 'react'
import Navbar_init from './Navbar_init'
import Album from './Album'
import Footer from './Footer'

function Home() {
  return (
    <div>
      <Navbar_init/>
      <Album/>
      <Footer/>
    </div>
  )
}

export default Home
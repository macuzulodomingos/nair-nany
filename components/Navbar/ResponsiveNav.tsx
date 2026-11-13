"use client";
import { useState } from 'react'
import Navbar from "@/components/Navbar/Navbar"
import MobileNav from "@/components/Navbar/MobileNav"

const ResponsiveNav = () => {
    const [showNav, setShowNav] = useState(false);

    const showNavhandle=()=>setShowNav(true);
    const closeNavhandle=()=>setShowNav(false);

  return (
    <div>
        <Navbar openNav={showNavhandle}/>
        <MobileNav showNav={showNav} closeNav={closeNavhandle}/>
    </div>
  )
}

export default ResponsiveNav

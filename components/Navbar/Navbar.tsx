"use client";
import { NavLinks } from "@/components/Navbar/constant";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


type Props = {
    openNav: ()=> void;
}

const Navbar = ({ openNav }:Props) => {
    const [navBg, setNavBg] = useState(false);
    const pathname = usePathname(); // substitui useLocation

    useEffect(() => {
        const handler = () => {
            if (window.scrollY >= 90) {setNavBg(true)};
            if (window.scrollY < 90) setNavBg(false);
        };
         window.addEventListener("scroll", handler)

         return () => window.removeEventListener("scroll", handler);

    },[]);

  return (
    <div className={`fixed ${navBg ? "bg-navy/95 backdrop-blur-md border-b border-gold/20" : "fixed"} h-[12vh] z-50 w-full transition-all`}>
        <div className='flex items-center h-full justify-between w-[95%] sm:w-[90%] xl:w-[80%] mx-auto'>
            {/* LOGO */}
            <Link
              href="/"
              className="text-2xl md:text-3xl font-serif font-bold text-gold hover:text-white transition-colors"
            >
              Nair Nany
            </Link>

            {/* Link */}
            <div className='flex items-center space-x-10'>
                <div className='hidden lg:flex items-center space-x-8'>
                    {NavLinks.map((navlink) => {
                        return (
                            <Link key={navlink.id} href={navlink.url} className={cn(
                                              "text-sm font-medium transition-colors hover:text-gold",
                                              pathname === navlink.url
                                                ? "text-white"
                                                : "text-primary-foreground/80"
                                            )}>
                                <p className=''>{navlink.label}</p>
                            </Link>
                        )
                    })}
                </div>

                {/* Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={openNav}
                    className="lg:hidden"
                >
                    <Menu onClick={openNav} className='text-white '/>
                </Button>
                <div>
                    
                    {/* Burger */}
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar
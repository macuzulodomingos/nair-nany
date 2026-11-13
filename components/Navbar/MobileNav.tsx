"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { NavLinks } from "@/components/Navbar/constant";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav = ({ showNav, closeNav }: Props) => {
  const navOpen = showNav ? "translate-x-0" : "-translate-x-full";
  const pathname = usePathname();

  return (
    <>
      {/* Overlay fora do menu */}
      {showNav && (
        <div
          onClick={closeNav}
          className="fixed inset-0 z-9999 bg-black/70"
        />
      )}

      {/* Menu */}
      <div
        className={`fixed top-0 left-0 z-10000 h-screen w-[90%] sm:w-[80%]
        transform transition-transform duration-500 ease-in-out
        ${navOpen} overflow-hidden`}
      >
        {/* Imagem de fundo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/imagens/fotoMenu.jpg"
            alt="Menu background"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Overlay escuro sobre a imagem */}
        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* Conteúdo */}
        <div className="relative z-20 flex flex-col justify-center h-full space-y-6 text-white">
          {NavLinks.map((navlink) => (
            <Link
              key={navlink.id}
              href={navlink.url}
              onClick={closeNav}
              className={cn(
                "text-lg font-medium transition-colors",
                pathname === navlink.url
                  ? "text-gold"
                  : "text-white/80 hover:text-white"
              )}
            >
              <p className="ml-12 text-[20px] hover:text-gold border-b border-white pb-2">
                {navlink.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Botão fechar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={closeNav}
          className="absolute top-4 right-4 z-30"
        >
          <X className="w-6 h-6 text-white" />
        </Button>
      </div>
    </>
  );
};

export default MobileNav;

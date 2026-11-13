import './globals.css'
import ResponsiveNav from '@/components/Navbar/ResponsiveNav';
import { Footer } from '@/components/Footer';
import { Playfair_Display, Inter } from 'next/font/google';
import { Toaster } from "sonner";
import { AuthProvider } from '@/lib/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
});


export const metadata = {
  title: 'Nair Nany',
  description: 'Cantora gospel.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white font-sans">
        <AuthProvider>
          <ResponsiveNav />
          {children}
          {/* Componente que mostra os toasts */}
          <Toaster richColors />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}

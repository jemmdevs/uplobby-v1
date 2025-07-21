import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UpLobby - Project Repository",
  description: "A platform to showcase your projects",
  verification: {
    google: "46o97_YUCtw8GPhTYYdL0gnrOwPG6maIhPc0U_ba0ZA",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pb-16 md:pb-0"> {/* Añadimos padding-bottom para evitar que el contenido quede detrás de la barra móvil */}
              {children}
            </main>
            <footer className="bg-white dark:bg-[var(--mongodb-navy)] py-6 border-t border-gray-200 dark:border-gray-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex flex-wrap justify-center space-x-6 text-sm">
                    <a 
                      href="/terms" 
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Términos de Servicio
                    </a>
                    <a 
                      href="/privacy" 
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Política de Privacidad
                    </a>
                    <a 
                      href="/cookies" 
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      Política de Cookies
                    </a>
                  </div>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} UpLobby. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
            <MobileNavbar /> {/* Barra de navegación móvil */}
          </div>
        </Providers>
      </body>
    </html>
  );
}

import { Inter } from "next/font/google";
import "./globals.css";
import CustomSWRConfig from '../customSWRConfig.js';
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Flashcards SaaS",
  description: "A web app to generate a set of flashcards for any topic with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <CustomSWRConfig>
            {children}
          </CustomSWRConfig>
        </ClerkProvider>
      </body>
    </html>
  );
}
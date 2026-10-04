import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const roboto = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Home | Sacrament Meetings',
    template: '%s | Sacrament Meetings',
  },
  description:
    'Home page for sacrament meetings.',
  metadataBase: new URL('https://sacrament-meetings-omega.vercel.app'),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header wardName="Florida 1st Ward" />
        {children}
        <Footer />
      </body>
    </html>
  );
}

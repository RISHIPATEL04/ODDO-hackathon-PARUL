import Navbar from "@/components/layout/Navbar";
import AuthProvider from "@/components/layout/AuthProvider";
import "./globals.css";

export const metadata = {
  title: "Traveloop | Plan Your Dream Trip",
  description: "Personalized, intelligent, and collaborative platform that transforms the way individuals plan and experience travel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

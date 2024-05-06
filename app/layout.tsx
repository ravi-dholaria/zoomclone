import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YOOM",
  description: "Video Calling App",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: "/icons/logo.svg",
          socialButtonsVariant: "iconButton",
        },
        variables: {
          colorText: "#fff",
          colorPrimary: "#0E78F9",
          colorBackground: "#1C1F2E",
          colorInputBackground: "#252A41",
          colorInputText: "#fff",
          colorAlphaShade: "#ffffff",
        },
      }}
    >
      <html lang="en">
        <head>
          <title>Yoom</title>
          <meta
            name="description"
            content="A web-based video conferencing application for seamless communication"
          />
          <meta
            name="keywords"
            content="video conferencing, online meetings, web meetings"
          />
          <meta name="author" content="Ravi Dholariya" />
          <meta
            property="og:title"
            content="Yoom - Your Video Conferencing Solution"
          />
          <meta
            property="og:description"
            content="A web-based video conferencing application..."
          />
          <meta
            property="og:image"
            content="https://private-user-images.githubusercontent.com/67959015/317983098-f09a8421-67d3-45ce-b9bc-a791cdc2774b.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTUwMDU2ODksIm5iZiI6MTcxNTAwNTM4OSwicGF0aCI6Ii82Nzk1OTAxNS8zMTc5ODMwOTgtZjA5YTg0MjEtNjdkMy00NWNlLWI5YmMtYTc5MWNkYzI3NzRiLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA1MDYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNTA2VDE0MjMwOVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWIzOTlmMjk0YjBlODQ5YjllZDdmZmEzY2M0ZTk3OWNmNDYxYjY2NjYwZmIwZGQyY2Q3MjZlY2JlODc2YmU2OGImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.IaAMgqtP5Rd88zLhTY6UHLF5VPRj0AwAjhuu2EJBuG4"
          />
        </head>
        <body className={`${inter.className} bg-dark-2`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

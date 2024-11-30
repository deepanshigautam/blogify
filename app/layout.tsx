// app/layout.tsx
import { AuthProvider } from '../lib/context/AuthContext';
import Head from 'next/head';  // Import Head from next/head
import './globals.css';

type Metadata = {
  title: string;
  description: string;
};

export const metadata: Metadata = {
  title: "Blogify", // Explicitly typed as a string
  description: "A blog website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Use the Head component */}
        <Head>
          <title>{metadata.title}</title> {/* Title will now be a string */}
        </Head>
      </head>
      <body className="bg-primary text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

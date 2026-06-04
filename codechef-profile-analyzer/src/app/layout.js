import './globals.css'

export const metadata = {
  title: 'CodeChef Profile Analyzer',
  description: 'Interactive analytics visualization platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
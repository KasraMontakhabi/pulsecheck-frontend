import './globals.css'

export const metadata = {
  title: 'PulseCheck - Uptime Monitoring',
  description: 'Monitor your websites and APIs with real-time uptime tracking',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
import type { Metadata } from 'next'
import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
}

const donutChartStyles = {
  track: {
    stroke: '#e2e8f0',
  },
  indicator: {
    stroke: '#22c55e',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}
        <SpeedInsights />
      </body>
    </html>
  )
}

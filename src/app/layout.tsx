import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Casteliyo — Your movement, your momentum', description: 'Your personal camera workout coach. Count reps and build consistency.' };
export default function Layout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }

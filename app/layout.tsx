import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { initializeTypeStyles } from '@/app/lib/utils/typeStyles';

// Initialize type styles when the app starts
initializeTypeStyles().catch(console.error);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
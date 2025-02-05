import './global.css';
import { inter } from '@/src/presentation/components/shared/fonts';
import { initializeTypeStyles } from '@/src/presentation/utils/ui/type-styles.utils';

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
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-indexeddb-manager basic test',
  description: 'react-indexeddb-manager basic test',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}

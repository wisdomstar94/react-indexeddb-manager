import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-indexeddb-manager test',
  description: 'react-indexeddb-manager test',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}

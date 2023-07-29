import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-indexeddb-manager sync-get-and-delete-test',
  description: 'react-indexeddb-manager sync-get-and-delete-test',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}

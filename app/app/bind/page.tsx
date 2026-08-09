import { BindClient } from './BindClient';

export const metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function BindPage() {
  return <BindClient />;
}

import { redirect } from 'next/navigation';

export default function TripsPage() {
  // We use the dashboard as the primary trips overview page
  redirect('/dashboard');
}


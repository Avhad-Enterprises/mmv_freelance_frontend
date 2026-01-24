import { redirect } from 'next/navigation';

export default function Page() {
  // Redirect old route to the new completed-projects path
  redirect('/dashboard/client-dashboard/completed-projects');
}


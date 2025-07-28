import { Metadata } from 'next';

import { MyApplicationsPageClient } from '@/features/projects/components/my-applications';

export const metadata: Metadata = {
  title: 'My Applications | CS Guild',
  description: 'Track your project application status and view feedback from project owners.',
};

export default function MyApplicationsPage() {
  return <MyApplicationsPageClient />;
}

import { Metadata } from 'next'

import { AboutAwsCloudClubPage } from '@/components/about'

export const metadata: Metadata = {
  title: 'About AWS Cloud Club | Amazon Web Services Cloud Club',
  description: 'Learn about the AWS Cloud Club - empowering students to master cloud computing through hands-on learning with Amazon Web Services.',
  keywords: ['AWS', 'Cloud Computing', 'Amazon Web Services', 'Student Organization', 'Technology', 'Certification'],
}

export default function AboutAwsCloudClub() {
  return <AboutAwsCloudClubPage />
}

import type { Metadata } from 'next'

import { FACILITIES_METADATA } from '@/constants'
import { FacilitiesClient } from '@/features/facilities'

export const metadata: Metadata = FACILITIES_METADATA

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex-1">
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-5 pointer-events-none" />
        
        {/* Page Header */}

        {/* Client Component */}
        <FacilitiesClient />
      </main>
    </div>
  )
}

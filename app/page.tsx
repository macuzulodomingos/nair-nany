import { HeroSection } from '@/components/HeroSection'
import { IntroSection } from '@/components/IntroSection'
import { PrayerRequestSection } from '@/components/PrayerRequestSection'
import { SocialGrid } from '@/components/SocialGrid'
import { WhatsAppButton } from '@/components/WhatsAppButton'


export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <IntroSection />
      <PrayerRequestSection />
      <WhatsAppButton />
     
    </main>
  )
}

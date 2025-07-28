'use client'

import { useLocalStorage } from '@/hooks/use-local-storage'

export function usePinnedProjectsVisibility() {
  const [cardsVisible, setCardsVisible] = useLocalStorage('pinnedProjectsCardsVisible', true)

  const hideCards = () => setCardsVisible(false)
  const showCards = () => setCardsVisible(true)
  const toggleCards = () => setCardsVisible(!cardsVisible)

  return {
    cardsVisible,
    hideCards,
    showCards,
    toggleCards
  }
}

export interface Offer {
  id: string
  title: string
  description: string
  difficulty: 'VERY EASY' | 'EASY' | 'MEDIUM' | 'HARD'
  reward: string
  url: string
  icon?: string
  category?: string
}

export interface OfferApiResponse {
  success: boolean
  offers: Offer[]
  error?: string
}

const API_BASE_URL = 'https://lockverify.org/api/v2'
const API_KEY = '35773|Pzp99YWeeTca2mis4E97Ug2JzcjRdjRzfQu7Jr3lccff66c7'

export async function fetchOffers(
  userIP: string,
  userAgent: string,
  maxOffers: number = 4
): Promise<OfferApiResponse> {
  try {
    // Build query parameters - request exactly 4 offers
    const params = new URLSearchParams({
      ip: userIP,
      user_agent: userAgent,
      max: '4',
      min: '4'
    })

    const response = await fetch(`${API_BASE_URL}?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      }
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('API Response:', data) // Debug log
    console.log('Number of offers from API:', data.offers?.length || 0)
    
    // Transform the API response to our Offer interface - NO FILTERING, USE ALL API OFFERS
    const offers: Offer[] = data.offers?.map((offer: any, index: number) => ({
      id: offer.offerid?.toString() || `offer-${index}`,
      title: offer.name_short || offer.name || 'Complete Offer',
      description: offer.adcopy || offer.description || 'Complete this offer to unlock premium scripts',
      difficulty: getDifficultyFromOffer(offer, index),
      reward: 'Premium Scripts Access',
      url: offer.link || '#',
      icon: offer.picture || getDefaultOfferIcon(index),
      category: offer.device || 'General'
    })) || []

    console.log('API offers count:', offers.length)
    console.log('API offers:', offers.map(o => o.title))
    
    return {
      success: true,
      offers: offers
    }
  } catch (error) {
    console.error('Error fetching offers:', error)
    return {
      success: false,
      offers: [],
      error: error instanceof Error ? error.message : 'Failed to fetch offers'
    }
  }
}

function getDifficultyFromOffer(offer: any, index: number): Offer['difficulty'] {
  // Sequential difficulty based on position (no HARD badge)
  const difficulties: Offer['difficulty'][] = ['VERY EASY', 'EASY', 'MEDIUM', 'MEDIUM']
  return difficulties[index % difficulties.length]
}

function getDefaultOfferIcon(index: number): string {
  const icons = [
    'https://cdn-icons-png.flaticon.com/512/888/888857.png', // App icon
    'https://cdn-icons-png.flaticon.com/512/888/888854.png', // Game icon
    'https://cdn-icons-png.flaticon.com/512/888/888851.png', // Survey icon
    'https://cdn-icons-png.flaticon.com/512/888/888848.png'  // Download icon
  ]
  return icons[index % icons.length]
}

export async function getUserIP(): Promise<string> {
  try {
    if (typeof window === 'undefined') {
      return '127.0.0.1' // Server-side fallback
    }
    
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error('Error fetching IP:', error)
    return '127.0.0.1' // Fallback IP
  }
}

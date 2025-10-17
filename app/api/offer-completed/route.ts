import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Offer completion received:', body)
    
    // Basic acknowledgement without returning script links
    const { offer_id, user_ip, user_agent, status, game_name } = body
    
    if (status === 'completed') {
      console.log(`Offer ${offer_id} completed by ${user_ip} for game: ${game_name}`)
      // Store completion in database or trigger any server-side tracking as needed
      return NextResponse.json({ success: true, message: 'Offer completion recorded' })
    }
    
    return NextResponse.json({ success: false, message: 'Offer not completed' })
  } catch (error) {
    console.error('Error handling offer completion:', error)
    return NextResponse.json({ error: 'Failed to process completion' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Offer completion endpoint' })
}

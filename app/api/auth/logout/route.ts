import { NextResponse } from 'next/server'
import { removeAuthCookie } from '@/lib/auth'

export async function POST() {
  try {
    await removeAuthCookie()

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

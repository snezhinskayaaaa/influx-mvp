import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName, role, ...roleData } = body

    // Validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    if (role !== 'INFLUENCER' && role !== 'BRAND') {
      return NextResponse.json(
        { success: false, error: 'Role must be INFLUENCER or BRAND' },
        { status: 400 }
      )
    }

    // Check for existing email
    const existingProfile = await prisma.profile.findUnique({
      where: { email },
    })

    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // For influencers, check handle uniqueness
    if (role === 'INFLUENCER') {
      if (!roleData.handle || typeof roleData.handle !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Handle is required for influencers' },
          { status: 400 }
        )
      }

      const existingHandle = await prisma.influencer.findUnique({
        where: { handle: roleData.handle },
      })

      if (existingHandle) {
        return NextResponse.json(
          { success: false, error: 'This handle is already taken' },
          { status: 409 }
        )
      }
    }

    // For brands, check company name
    if (role === 'BRAND') {
      if (!roleData.companyName || typeof roleData.companyName !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Company name is required for brands' },
          { status: 400 }
        )
      }
    }

    const passwordHash = await hashPassword(password)
    const profileId = crypto.randomUUID()

    // Create profile + role-specific record atomically
    const profile = await prisma.$transaction(async (tx) => {
      const newProfile = await tx.profile.create({
        data: {
          id: profileId,
          email,
          passwordHash,
          fullName: fullName || null,
          role,
        },
      })

      if (role === 'BRAND') {
        await tx.brand.create({
          data: {
            userId: newProfile.id,
            companyName: roleData.companyName,
            industry: roleData.industry || null,
            website: roleData.website || null,
            description: roleData.description || null,
            contactName: roleData.contactName || null,
            contactEmail: roleData.contactEmail || null,
          },
        })
      }

      if (role === 'INFLUENCER') {
        await tx.influencer.create({
          data: {
            userId: newProfile.id,
            handle: roleData.handle,
            bio: roleData.bio || null,
            instagramHandle: roleData.instagramHandle || null,
            instagramFollowers: parseInt(String(roleData.instagramFollowers)) || 0,
            tiktokHandle: roleData.tiktokHandle || null,
            tiktokFollowers: parseInt(String(roleData.tiktokFollowers)) || 0,
            status: 'PENDING',
          },
        })
      }

      return newProfile
    })

    const token = await createToken({ userId: profile.id, role: profile.role })
    await setAuthCookie(token)

    return NextResponse.json(
      {
        success: true,
        user: {
          id: profile.id,
          email: profile.email,
          role: profile.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred', debug: process.env.NODE_ENV !== 'production' ? errorMessage : undefined },
      { status: 500 }
    )
  }
}

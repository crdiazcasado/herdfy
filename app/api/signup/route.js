import { NextResponse } from 'next/server'

export async function POST(request) {
  return NextResponse.json({ message: 'Signup API works!' })
}

export async function GET(request) {
  return NextResponse.json({ message: 'GET works!' })
}

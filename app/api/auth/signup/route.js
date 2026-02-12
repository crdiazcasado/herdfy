import { NextResponse } from 'next/server'

export async function POST(request) {
  return NextResponse.json({ message: 'API route works!' })
}

export async function GET(request) {
  return NextResponse.json({ message: 'GET also works!' })
}

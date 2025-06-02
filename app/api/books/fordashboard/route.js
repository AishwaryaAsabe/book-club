// app/api/books/fordashboard/route.js
import { NextResponse } from 'next/server'

export async function GET() {
//   const defaultQuery = 'fiction OR classic OR bestselling'
  const queries = ['fiction', 'classic', 'bestselling', 'mystery', 'science', 'fantasy']
  const randomQuery = queries[Math.floor(Math.random() * queries.length)]
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${randomQuery}&maxResults=6`)
    
    if (!res.ok) {
      console.error('Google Books API failed:', res.status, res.statusText)
      return NextResponse.json({ error: 'Failed to fetch from Google Books' }, { status: res.status })
    }

    const data = await res.json()

    if (!data.items) {
      console.warn('No books found for query')
      return NextResponse.json([], { status: 200 })
    }

    const books = data.items.map((item) => {
      const info = item.volumeInfo
      return {
        id: item.id,
        title: info.title,
        author: info.authors?.[0] || 'Unknown',
        description: info.description || '',
        thumbnail: info.imageLinks?.thumbnail || '',
        link: info.infoLink,
        categories:info.categories ||[],
        averageRating: info.averageRating || null, // ⭐ Add this line

      }
    })

    console.log('Fetched books:', books)

    return NextResponse.json(books, { status: 200 })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

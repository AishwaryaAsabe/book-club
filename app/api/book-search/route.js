// import { NextResponse } from 'next/server';

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const query = searchParams.get('q'); // e.g., ?q=power+of+now

//   if (!query) {
//     return NextResponse.json({ error: 'Query is required' }, { status: 400 });
//   }

//   try {
//     const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
//     const data = await response.json();

//     const books = data.items?.map(item => {
//       const info = item.volumeInfo;
//       return {
//         id: item.id,
//         title: info.title,
//         author: info.authors?.[0] || 'Unknown',
//         description: info.description || '',
//         thumbnail: info.imageLinks?.thumbnail || '',
//         link: info.infoLink,
//         categories:info.categories ||[],
//         averageRating: info.averageRating || null, // ⭐ Add this line

//       };
//     }) || [];

//     return NextResponse.json({ books }, { status: 200 });

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Error fetching book data' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const genre = searchParams.get('genre');

  const defaultGenres = ['fiction', 'romance', 'bestselling', 'mystery', 'science fiction', 'history'];

  try {
    let books = [];

    if (search) {
      // Search by user input
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=12`);
      const data = await res.json();

      books = data.items?.map((item) => {
        const info = item.volumeInfo;
        return {
          id: item.id,
          title: info.title,
          author: info.authors?.[0] || 'Unknown',
          description: info.description || '',
          thumbnail: info.imageLinks?.thumbnail || '',
          link: info.infoLink,
          genre: info.genre || [],
          averageRating: info.averageRating || null,
          totalRatings: info.ratingsCount || 0,
        };
      }) || [];
    } else {
      // No search term
      const genresToUse =
        genre && genre !== 'all'
          ? [genre]
          : defaultGenres.sort(() => 0.5 - Math.random()).slice(0, 3); // 3 genres randomly

      const results = await Promise.all(
        genresToUse.map(async (g) => {
          const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${g}&maxResults=8`);
          const data = await res.json();
          return data.items || [];
        })
      );

      const allItems = results.flat();
      const uniqueBooksMap = new Map();

      for (const item of allItems) {
        if (!uniqueBooksMap.has(item.id)) {
          const info = item.volumeInfo;
          uniqueBooksMap.set(item.id, {
            id: item.id,
            title: info.title,
            author: info.authors?.[0] || 'Unknown',
            description: info.description || '',
            thumbnail: info.imageLinks?.thumbnail || '',
            link: info.infoLink,
            genre: info.genre || [],
            averageRating: info.averageRating || null,
            totalRatings: info.ratingsCount || 0,
          });
        }
      }

      books = Array.from(uniqueBooksMap.values()).slice(0, 12); // Return max 12
    }

    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching book data' }, { status: 500 });
  }
}

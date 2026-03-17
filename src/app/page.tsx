import { getPosts } from '@/services/wordpress';

export default async function Home() {
  const data = await getPosts();
  const posts = data.posts.nodes || [];

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-12 border-b pb-6">
        <h1 className="text-4xl font-bold text-blue-900 font-sans">PGC UPV News</h1>
        <p className="text-gray-600 mt-2">Latest updates from the Philippine Genome Center Visayas</p>
      </header>

      <section className="grid gap-8">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <article key={post.id} className="group border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
              <h2 className="text-2xl font-semibold group-hover:text-blue-700 transition-colors">
                <span dangerouslySetInnerHTML={{ __html: post.title }} />
              </h2>
              <div 
                className="mt-4 text-gray-700 line-clamp-3 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.excerpt }} 
              />
              <div className="mt-6 flex items-center justify-between text-sm text-gray-500 font-medium">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span className="text-blue-600">Read more →</span>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No posts found from the live site.</p>
          </div>
        )}
      </section>
    </main>
  );
}

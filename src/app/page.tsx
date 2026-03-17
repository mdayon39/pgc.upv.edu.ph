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
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}

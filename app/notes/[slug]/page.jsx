import { getPost, postSlugs } from '@/lib/content';

export const dynamicParams = false;
export const generateStaticParams = () => postSlugs().map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: getPost(slug).title.replace(/^"(.*)"$/, '$1') };
}

export default async function Post({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  const date = new Date(`${post.date}T00:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <main id="main" className="post">
      <nav className="post-top" aria-label="Site">
        <a href="/">kaiwave</a>
        <a href="/#writing">All writing</a>
      </nav>
      <article className="post-sheet">
        <h1>{post.title}</h1>
        <p className="post-date">{date}</p>
        {post.paragraphs.map((html, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </article>
    </main>
  );
}

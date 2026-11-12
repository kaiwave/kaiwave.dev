// GitHub Pages has no server redirects, so /projects is a page that forwards to the projects section.
export const metadata = { title: 'Projects', robots: { index: false }, alternates: { canonical: '/' } };

export default function Projects() {
  return (
    <main id="main" className="post">
      <meta httpEquiv="refresh" content="0; url=/#work" />
      <p>
        <a href="/#work">Go to projects</a>
      </p>
    </main>
  );
}

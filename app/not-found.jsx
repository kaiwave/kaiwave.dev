export const metadata = { title: 'Not found' };

export default function NotFound() {
  return (
    <main id="main" className="post">
      <nav className="post-top" aria-label="Site">
        <a href="/">kaiwave</a>
      </nav>
      <div className="post-sheet">
        <h1>Off the ice</h1>
        <p className="post-date">This page does not exist, or it moved when the site was rebuilt.</p>
        <a className="btn" href="/">
          Back to the front page
        </a>
      </div>
    </main>
  );
}

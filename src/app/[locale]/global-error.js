'use client'; // Error boundaries must be Client Components

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <h2 className="sectionHeading">Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}

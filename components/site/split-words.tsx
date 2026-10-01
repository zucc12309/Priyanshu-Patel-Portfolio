/** Splits text into masked words that rise into place (CSS only). */
export function SplitWords({ text, delay = 0, step = 70 }: { text: string; delay?: number; step?: number }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="rise" aria-hidden>
        {text.split(" ").map((word, i) => (
          <span key={`${word}-${i}`}>
            <span style={{ animationDelay: `${delay + i * step}ms` }}>{word}</span>
          </span>
        ))}
      </span>
    </>
  );
}

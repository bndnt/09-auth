"use client";

interface ErrorProps {
  error: Error;
}

export default function FilterError({ error }: ErrorProps) {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>Something went wrong: {error.message}</p>
    </div>
  );
}

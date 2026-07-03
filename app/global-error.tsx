"use client";

import Link from "next/link";
import Image from "next/image";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex h-screen flex-col items-center justify-center gap-4 bg-dark-300 text-white">
        <Image
          src="/assets/icons/logo-icon.svg"
          height={100}
          width={100}
          alt="logo"
        />
        <h1 className="text-32-bold">Something went wrong!</h1>
        <p className="text-dark-600">{error.message}</p>
        <button
          onClick={reset}
          className="shad-primary-btn rounded-md px-6 py-3"
        >
          Try again
        </button>
        <Link href="/" className="text-green-500 underline">
          Go back home
        </Link>
      </body>
    </html>
  );
}

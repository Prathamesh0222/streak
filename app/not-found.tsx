import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center text-center justify-center h-screen">
      <div className="space-y-4">
        <h1 className="text-8xl font-bold text-red-500">404</h1>
        <h2 className="text-3xl font-medium text-gray-700 dark:text-gray-300">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-red-500 hover:bg-red-600"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

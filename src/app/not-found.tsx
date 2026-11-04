import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-sm text-slate-400 mb-2">404</p>
        <h1 className="text-4xl font-bold text-white mb-4">Page not found</h1>
        <p className="text-slate-400 mb-8">The page you asked for does not exist.</p>
        <Link href="/" className="inline-flex min-h-11 items-center text-blue-300 hover:text-white">
          Back to DevHub
        </Link>
      </div>
    </main>
  );
}

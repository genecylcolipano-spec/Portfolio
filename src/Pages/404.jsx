import { Home, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center animate-fadeIn">
        {/* 404 */}
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
            404
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#6366f1] to-[#a855f7] mx-auto rounded-full" />
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-200 mb-4">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for may have been moved, deleted, or never existed.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8">
          <div className="w-28 h-28 mx-auto rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center">
            <Search className="w-12 h-12 text-indigo-400/70" strokeWidth={1.3} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366f1]/20"
          >
            <Home size={20} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

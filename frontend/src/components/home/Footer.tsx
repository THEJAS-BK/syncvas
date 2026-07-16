export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-8 md:px-22 py-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#101820] tracking-tight">
            Syncvas
          </span>
          <span className="text-sm text-gray-400">
            © {new Date().getFullYear()}
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <a href="https://github.com" className="hover:text-[#101820] transition-colors">
            GitHub
          </a>
          <a href="/offlineboard" className="hover:text-[#101820] transition-colors">
            Offline board
          </a>
          <a href="#" className="hover:text-[#101820] transition-colors">
            About
          </a>
        </div>
      </div>
    </footer>
  );
}
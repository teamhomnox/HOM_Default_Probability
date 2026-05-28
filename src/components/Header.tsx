export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ height: 52 }}>
        {/* Logo */}
        <div className="flex items-center gap-16">
          <img
            src="https://auacshfstiixbameivqu.supabase.co/storage/v1/object/public/web.page.imges/HOM_Web_Logo_vertical.png"
            alt="HOMNOX Analytics"
            className="h-9 w-auto object-contain"
          />
          <span className="text-sm font-bold text-gray-900 tracking-tight">HOMNOX Analytics</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">Probability of Default</span>
          <span className="text-gray-300 text-xs">|</span>
          <span className="text-xs text-gray-400 font-mono">Altman Z-Score</span>
          <button className="bg-gray-900 text-white text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">
            INVESTOR DEMO
          </button>
        </div>
      </div>
    </header>
  )
}

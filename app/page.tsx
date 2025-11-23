import Link from "next/link";

export default function Home() {
  return(
    <div className="w-[360px] h-[800px] bg-[#111111] text-white mx-auto relative">
      <h1 className="text-2xl font-bold mb-6 text-center">Jazz Chronicle</h1>
      <p className="text-sm text-center">History of Jazz</p>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <Link 
          href="/01_how_to_enjoy" 
          className="px-8 py-3 border-2 border-[#BAEE2A] font-bold text-center shadow-[0_0_10px]">
            Enter
        </Link>
      </div>
      
      <p className="text-sm text-center">©2025 FIG.1 STUDIO</p>
    </div>
  )
}
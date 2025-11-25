import Link from "next/link";

export default function Home() {
  return(
    <div className="w-[360px] h-[800px] bg-[url('/img/bg_main.png')] bg-cover bg-center text-white mx-auto relative">
      
      <p className="text-xl text-center text-[#787878] font-bold absolute top-68 left-1/2 transform -translate-x-1/2 font-DogicaPixel font-bold">HISTORY OF JAZZ</p>
      <video src="/img/window.mp4" autoPlay loop muted className="absolute top-79.5 left-1/2 transform -translate-x-1/2 object-cover scale-48"></video>
      
      <div className="absolute bottom-44 left-1/2 transform -translate-x-1/2">
        <Link 
          href="/01_how_to_enjoy" 
          className="px-8 py-3 border-2 border-[#BAEE2A] font-bold text-center shadow-[0_0_10px]">
            ENTER
        </Link>
      </div>
      
      <p className="text-sm text-center text-[#787878] absolute bottom-20 left-1/2 transform -translate-x-1/2 font-DogicaPixel font-bold">©2025 FIG.1 STUDIO</p>
    </div>
  )
}
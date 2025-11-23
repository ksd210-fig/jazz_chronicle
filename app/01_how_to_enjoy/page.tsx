import Link from "next/link";

export default function HowToEnjoy() {
  return(
    <div>
      <Link href="/">HOME</Link>
      <h1>How to Enjoy</h1>
      <p>How to enjoy jazz</p>
      <Link href="/02_select_genre">Next</Link>
    </div>
  )
}
"use client"
import dynamic from "next/dynamic";
import styles from '../../styles/st.module.css'

const BettingGame = dynamic(() => import("@/components/BettingGame"), {
  ssr: false,
})

export default function Home() {
  return (
    <div className={styles.con1}>
    <main className="flex min-h-screen flex-col items-center pt-10">
      <h1 className="text-4xl font-bold mb-8"> Welcome to Mine Betting Game</h1>
      <BettingGame />
    </main>
    </div>
  )
}

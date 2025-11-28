import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './style/App.css'
import Home from './pages/Home'
import MobDetails from './pages/MobDetails'
import Navbar from './components/Navbar'
import { mob_list } from './constants'

function App() {
  const [mobs, setMobs] = useState(mob_list)

  const playMobSound = (mobId) => {
    setMobs(prevMobs =>
      prevMobs.map(mob =>
        mob.id === mobId
          ? { ...mob, isPlayingSound: true }
          : mob
      )
    )

    const mob = mobs.find(m => m.id === mobId)
    if (mob && mob.sound) {
      const audio = new Audio(mob.sound)
      audio.play()

      audio.onended = () => {
        setMobs(prevMobs =>
          prevMobs.map(mob =>
            mob.id === mobId
              ? { ...mob, isPlayingSound: false }
              : mob
          )
        )
      }
    }
  }

  return (
    <div className="app">
      <main className="main-content">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Home mobs={mobs} onPlaySound={playMobSound} />
            }
          />
          <Route
            path="/mob/:id"
            element={
              <MobDetails mobs={mobs} onPlaySound={playMobSound} />
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
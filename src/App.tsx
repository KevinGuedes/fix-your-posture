import { FormEvent, useEffect, useState } from 'react'
import { PWABadge } from './PWABadge.tsx'
import beep from './assets/beep.wav'
import { Timer, TimerOff } from 'lucide-react'
import { add } from 'date-fns'
import * as RadioGroup from '@radix-ui/react-radio-group'

const audio = new Audio(beep)

export function App() {
  const [cadenceInMinutes, setCadenceInMinutes] = useState(0)
  const [remainingTime, setRemainingTime] = useState<number | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const times = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]

  function handleStartTimer(event: FormEvent) {
    event.preventDefault()
    if (isNaN(cadenceInMinutes) || cadenceInMinutes <= 0) return

    setEndDate(add(new Date(), { minutes: cadenceInMinutes, seconds: 1 }))
  }

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null

    function handeTimeEvents(endDate: Date) {
      const diffInSeconds = Math.floor(
        (endDate.getTime() - new Date().getTime()) / 1000,
      )

      setRemainingTime(diffInSeconds)

      if (diffInSeconds <= 0) {
        audio.play()
        setEndDate(add(new Date(), { minutes: cadenceInMinutes, seconds: 1 }))
      }

      document.title = `Fix Your Posture! - ${Math.floor(diffInSeconds / 60)
        .toString()
        .padStart(2, '0')}:${(diffInSeconds % 60).toString().padStart(2, '0')}`
    }

    if (endDate) {
      handeTimeEvents(endDate)
      intervalId = setInterval(() => handeTimeEvents(endDate), 1000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [cadenceInMinutes, endDate])

  function handleStopTimer() {
    setEndDate(null)
    setRemainingTime(null)
  }

  const isCandenceSelected = cadenceInMinutes > 0
  const isTimerRunning = remainingTime !== null
  const remainingMinutes = remainingTime ? Math.floor(remainingTime / 60) : '00'
  const remainingSeconds = remainingTime ? remainingTime % 60 : '00'
  const formattedRemainingTime = `${remainingMinutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`

  useEffect(() => {
    if (isTimerRunning) {
      document.title = `Next beep in ${formattedRemainingTime}!`
    } else {
      document.title = `Fix Your Posture!`
    }
  }, [isTimerRunning, formattedRemainingTime])

  return (
    <main className="flex min-h-dvh items-start justify-center bg-sky-900 p-4">
      <div className="relative mx-auto my-auto space-y-8">
        <header className="flex flex-col items-center gap-2">
          <h1 className="text-center text-4xl text-white sm:text-5xl">
            Fix Your Posture!
          </h1>
          <p className="text-pretty text-center text-sm text-white">
            Select a cadence to remind you to fix your posture.
          </p>
        </header>
        <div className="flex w-full flex-col justify-between gap-6">
          <RadioGroup.Root
            className="grid grid-cols-2 gap-4 sm:grid-cols-3"
            aria-label="Cadence in minutes"
            onValueChange={(value) => setCadenceInMinutes(Number(value))}
            value={cadenceInMinutes.toString()}
          >
            {times.map((time) => (
              <label
                key={time}
                className={`flex cursor-pointer items-center gap-2 rounded-md border-2 border-sky-600 px-3 py-2 font-medium text-white transition-all hover:border-emerald-500 has-[:disabled]:pointer-events-none has-[:disabled]:select-none has-[:disabled]:opacity-70 ${time === cadenceInMinutes ? 'border-emerald-500' : ''}`}
                htmlFor={time.toString()}
              >
                <RadioGroup.Item
                  className="size-6 cursor-pointer rounded-full border-2 border-emerald-700 bg-white outline-none transition-colors hover:bg-emerald-700/90 focus:shadow-[0_0_0_2px] focus:shadow-sky-500 disabled:pointer-events-none disabled:select-none disabled:opacity-50"
                  value={time.toString()}
                  id={time.toString()}
                  disabled={isTimerRunning}
                >
                  <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:size-3 after:rounded-[50%] after:bg-emerald-500 after:content-['']" />
                </RadioGroup.Item>
                {time} min
              </label>
            ))}
          </RadioGroup.Root>
          {isTimerRunning ? (
            <button
              type="button"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-purple-600 px-4 py-1 font-medium text-white transition-colors hover:bg-purple-500"
              onClick={handleStopTimer}
            >
              Stop Timer <TimerOff className="size-5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!isCandenceSelected || isTimerRunning}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-1 font-medium text-white transition-colors hover:bg-emerald-500 disabled:pointer-events-none disabled:select-none disabled:opacity-50"
              onClick={handleStartTimer}
            >
              Start Timer <Timer className="size-5" />
            </button>
          )}
        </div>

        {isTimerRunning && (
          <div className="absolute -bottom-12 left-1/2 mx-auto flex -translate-x-1/2 items-center gap-1.5">
            <p className="text-2xl font-medium text-white">
              {formattedRemainingTime}
            </p>
          </div>
        )}
      </div>
      <PWABadge />
    </main>
  )
}

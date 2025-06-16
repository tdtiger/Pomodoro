import { useState, useEffect, useRef } from 'react'
import './App.css'

function App(){
  const workTime = 25 * 60;
  const breakTime = 5 * 60;

  const [seconds, setSeconds] = useState(workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [count, setCount] = useState(Number(localStorage.getItem('pomodoroCount')) || 0);
  const [progress, setProgress] = useState(100);

  const intervalRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('pomodoroCount', count);
  }, [count]);

  useEffect(() => {
    if(isRunning && !isPaused){
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused]);


  useEffect(() => {
    if (seconds <= 0) {
      clearInterval(intervalRef.current);
      if (isWorkTime) {
        setCount((c) => c + 1);
        setSeconds(breakTime);
        setIsWorkTime(false);
      } else {
        setSeconds(workTime);
        setIsWorkTime(true);
      }
    }
  }, [seconds]);

  useEffect(() => {
    const total = isWorkTime ? workTime : breakTime;
    const persent = (seconds / total ) * 100;
    setProgress(persent);
  }, [seconds, isWorkTime]);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    } else {
      setIsPaused(false);
    }
  };

  const pause = () => {
    setIsPaused(!isPaused);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setIsWorkTime(true);
    setSeconds(workTime);
  };

  const formatTime = () => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className="App">
      <h1>ポモドーロタイマー</h1>
      <h2>{isWorkTime ? '作業時間' : '休憩時間'}</h2>
      <h1>{formatTime()}</h1>
      <button onClick = {start}>スタート</button>
      <button onClick = {pause}>一時停止</button>
      <button onClick = {reset}>リセット</button>
      <p>完了回数: {count}</p>

      <div className = "progress-bar-container">
        <div className = "progress-bar" style = {{width: `${progress}%`, backgroundColor : isWorkTime ? '#4caf50' : '#2196f3'}}></div>
      </div>
    </div>
  );
}

export default App;
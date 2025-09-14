// src/components/ChronometerModal/ChronometerModal.tsx
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from './ChronometerModal.module.css';
import { FaPlay, FaPause, FaStop, FaSync } from 'react-icons/fa';

interface ChronometerModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onStop: (elapsedSeconds: number) => void;
}

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export function ChronometerModal({ isOpen, onRequestClose, onStop }: ChronometerModalProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = window.setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => window.clearInterval(interval);
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };

  const handleStop = () => {
    setIsRunning(false);
    onStop(elapsedTime);
    setElapsedTime(0); // Reseta para a próxima vez
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>Cronômetro de Estudo</h2>
      <div className={styles.timeDisplay}>
        {formatTime(elapsedTime)}
      </div>
      <div className={styles.controls}>
        <button onClick={handleReset} title="Reiniciar"><FaSync /></button>
        <button onClick={handleStartPause} className={styles.playPauseButton}>
          {isRunning ? <FaPause size={30} /> : <FaPlay size={30} />}
        </button>
        <button onClick={handleStop} title="Parar e Registrar"><FaStop /></button>
      </div>
    </Modal>
  );
}
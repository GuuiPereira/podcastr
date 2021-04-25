
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import Slider from 'rc-slider';

import { usePlayer } from '../../contexts/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss';

export function Player() {

  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    hasNext,
    hasPrevious,
    isPlaying,
    isLooping,
    isShuffling,
    tooglePlay,
    toogleLoop,
    toogleShuffling,
    playNext,
    playPrevious,
    setPlayingState,
    clearPlayerState
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

  }, [isPlaying])

  function setupProgressListener(){

    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () =>{
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

  function handleEpisodeEnded(){

    if(hasNext){
      playNext();
    }else {
      clearPlayerState();
    }
  }

  function handleSeek(amount:number){

    audioRef.current.currentTime = amount;
    setProgress(amount);

  }

  return (
    <div className={styles.playerContainer}>

      <header>
        <img src="/playing.svg" alt="Tocando agora"></img>
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit='cover'
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>

        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#84d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#84d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>

          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            ref={audioRef}
            src={episode.url}
            autoPlay
            loop={isLooping}
            onEnded={handleEpisodeEnded}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toogleShuffling}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar"></img>
          </button>
          <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar Anterior"></img>
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={() => { tooglePlay() }}
          >
            {isPlaying ? <img src="/pause.svg" alt="Tocar"></img> : <img src="/play.svg" alt="Tocar"></img>}

          </button>
          <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar Próxima"></img>
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toogleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir"></img>
          </button>
        </div>

      </footer>

    </div>
  )
}

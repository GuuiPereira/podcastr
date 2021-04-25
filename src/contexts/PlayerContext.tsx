import { createContext, useState, ReactNode, useContext } from 'react';
type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string
}

type PlayerContextData = {
  episodeList: Array<Episode>
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isShuffling: boolean;
  isLooping: boolean;
  hasNext: boolean,
  hasPrevious: boolean,
  play: (episode: Episode) => void;
  playList: (listEpisode: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  tooglePlay: () => void;
  toogleLoop: () => void;
  toogleShuffling: () => void;
  setPlayingState: (value: boolean) => void;
  clearPlayerState:() => void;
}

type PlayerContextProviderProps = {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {

  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function playList(listEpisode: Episode[], index: number) {

    setEpisodeList(listEpisode);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);

  }
  function play(episode: Episode) {

    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);

  }

  function playNext() {

    if (isShuffling) {

      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);

    } else if (hasNext) {

      setCurrentEpisodeIndex(currentEpisodeIndex + 1);

    }
  }

  function playPrevious() {

    if (hasPrevious) {

      setCurrentEpisodeIndex(currentEpisodeIndex - 1);

    }

  }

  function tooglePlay() {

    setIsPlaying(!isPlaying);

  }

  function toogleShuffling() {

    setIsShuffling(!isShuffling);

  }

  function toogleLoop() {

    setIsLooping(!isLooping);

  }

  function setPlayingState(state: boolean) {

    setIsPlaying(state);

  }

  function clearPlayerState() {

    setEpisodeList([]);
    setCurrentEpisodeIndex(0);

  }

  return (
    <PlayerContext.Provider
      value={{
        currentEpisodeIndex,
        episodeList,
        hasNext,
        hasPrevious,
        play,
        playNext,
        playPrevious,
        playList,
        isPlaying,
        isLooping,
        isShuffling,
        tooglePlay,
        toogleLoop,
        toogleShuffling,
        setPlayingState,
        clearPlayerState
      }}
    >
      {children}

    </PlayerContext.Provider>)
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}

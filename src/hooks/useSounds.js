import { sounds } from '../utils/sounds'

export function useSounds() {
  function playEnter() {
    sounds.chime()
  }

  function playSubmit() {
    sounds.bubble()
  }

  function playTransition() {
    sounds.whoosh()
  }

  function playClick() {
    sounds.click()
  }

  function playPiano() {
    sounds.piano()
  }

  function playSparkle() {
    sounds.sparkle()
  }

  return {
    playEnter,
    playSubmit,
    playTransition,
    playClick,
    playPiano,
    playSparkle,
  }
}
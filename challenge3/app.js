// create the list of 23 audio files that we have
const audioFiles = new Array(23)
  // fill with sample data
  .fill(1)
  .map((num, index) => ({ src: `audio/key-${index + 1}.mp3` }));

// keep track of playing
const playingAudios = new Map();

// get the anchor tags
document.querySelectorAll('a').forEach((a, index) => {
  a.onclick = function handleClick() {
    const audioFile = audioFiles[index];
    // if the same audio is playing already, then stop it first
    if (playingAudios.has(index)) {
      let playingAudio = playingAudios.get(index);
      playingAudio.pause();
      playingAudios.delete(index);
      // release audio memory then it can be safely GC'd
      playingAudio = null;
    }

    // create a new audio object to play
    const audio = new Audio(audioFile.src);

    // save it in the map first
    playingAudios.set(index, audio);

    // play the audio
    audio.play();

    // clear the audio if not already been cleared out from the playingAudios map
    audio.addEventListener('ended', function audioEnded() {
      if (playingAudios.has(index)) {
        playingAudios.delete(index);
      }
    });
  };
});

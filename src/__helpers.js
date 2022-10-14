export function getIndexOf(arr, k) {
  for (var i = 0; i < arr.length; i++) {
    var index = arr[i].indexOf(k);
    if (index > -1) {
      return [i, index];
    }
  }
}

export function playAudio(audio) {
  let playPromise = audio.play();
  // if (playPromise !== undefined) {
  //   playPromise
  //     .then((_) => {
  //       // Automatic playback started!
  //       // Show playing UI.
  //     })
  //     .catch((error) => {
  //       console.log("Game is ready - has not strated.");
  //     });
  // }
}

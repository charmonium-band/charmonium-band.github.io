function initAudioAnalyser() {
  window.currentVolume = 0.0;

  window.context = new AudioContext() || new webkitAudioContext();
  if (!window.context) {
    console.log('No support for WebAudio');
    return;
  }

  const audio = context.createMediaElementSource(document.getElementById('player'));
  const analyser = context.createAnalyser();

  analyser.smoothingTimeConstant = 0.9;
  analyser.fftSize = 512;

  audio.connect(analyser);
  analyser.connect(context.destination);

  window.currentVolume = 0.0;
  window.averaging = 0.97;
  window.analyser = analyser;

  function updateCurrentVolume() {
      var array = new Uint8Array(window.analyser.frequencyBinCount);
      window.analyser.getByteFrequencyData(array);

      var rms = 0;
      for (var i = 0; i < array.length; i++) {
        const sample = parseFloat(array[i]);
        rms += sample * sample;
      }

      rms = Math.sqrt(rms / array.length);
      rms = rms / 100.0;

      window.currentVolume = Math.max(rms, window.currentVolume * window.averaging);
      requestAnimationFrame(updateCurrentVolume);
  }
  updateCurrentVolume();
};

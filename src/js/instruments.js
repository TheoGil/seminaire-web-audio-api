var instruments = {
	hihat: {
		decay     : 0.1,
		noteLength: 0.5,
		init: function(){
			this.analyser = audioContext.createAnalyser();
			this.analyser.fftSize = 2048/4;
			this.analyser.connect(masterFilter);
			this.canvas = $('#canvasWaveformChannel1')[0];
			this.canvasCtx = this.canvas.getContext('2d');
		},
		play: function(time){
			var whiteNoise = audioContext.createBufferSource(),
				filter 	   = audioContext.createBiquadFilter(),
				amp        = audioContext.createGain();

		    whiteNoise.buffer = whiteNoiseBuffer;

			filter.type = 'highpass';
			filter.frequency.value = 12000;

			amp.gain.setValueAtTime(.5, time);
			amp.gain.linearRampToValueAtTime(0.01, time + this.decay);

			whiteNoise.connect(filter);
			filter.connect(amp);
			amp.connect(this.analyser);

			whiteNoise.start(time);
		    whiteNoise.stop( time + this.decay );
		}
	},
	snare: {
		frequency : 200,
		decay     : 0.2,
		init: function(){
			this.analyser = audioContext.createAnalyser();
			this.analyser.fftSize = 2048/4;
			this.analyser.connect(masterFilter);
			this.canvas = $('#canvasWaveformChannel2')[0];
			this.canvasCtx = this.canvas.getContext('2d');
		},
		play: function(time){
			var whiteNoise = audioContext.createBufferSource(),
				filter 	   = audioContext.createBiquadFilter(),
				amp        = audioContext.createGain(),
				osc 	   = audioContext.createOscillator()
				oscAmp     = audioContext.createGain();

		    whiteNoise.buffer = whiteNoiseBuffer;

			filter.type = 'highpass';
			filter.frequency.value = 1000;

			amp.gain.setValueAtTime(1, time);
			amp.gain.exponentialRampToValueAtTime(0.01, time + this.decay);

			whiteNoise.connect(filter);
			filter.connect(amp);
			amp.connect(this.analyser);

			osc.type = "square";
		    osc.frequency.setValueAtTime(this.frequency, time);
			osc.connect(oscAmp);
			oscAmp.connect(this.analyser);
			oscAmp.gain.setValueAtTime(.1, time);
			oscAmp.gain.exponentialRampToValueAtTime(0.01, time + this.decay * .25);

			whiteNoise.start(time);
		    whiteNoise.stop( time + this.decay );
		    osc.start(time);
		    osc.stop( time + this.decay );
		}
	},
	kick: {
		startFreq : 130.8,
		endFreq   : 0.01,
		pitchDecay: 0.1,
		release   : 0.5,
		init: function(){
			this.analyser = audioContext.createAnalyser();
			this.analyser.fftSize = 2048/4;
			this.analyser.connect(masterFilter);
			this.canvas = $('#canvasWaveformChannel3')[0];
			this.canvasCtx = this.canvas.getContext('2d');

            this.amp = audioContext.createGain();
		},
		play: function(time){
			var osc = audioContext.createOscillator();

			osc.frequency.setValueAtTime(this.startFreq, time);
			osc.frequency.linearRampToValueAtTime(this.endFreq, time + this.pitchDecay);

            this.amp.gain.cancelScheduledValues(time);
			this.amp.gain.setValueAtTime(1, time);
			this.amp.gain.linearRampToValueAtTime(0, time + this.release);

			osc.connect(this.amp);
			this.amp.connect(this.analyser);
			
			osc.start( time );
		    osc.stop( time + this.release );
		}
	},
	bass: {
		attack  : 0,
		release : 0,
		filterFreq : 18000,
		noteLength: 0.2,
		init: function(){
			this.analyser = audioContext.createAnalyser();
			this.analyser.fftSize = 2048/4;
			this.analyser.connect(masterFilter);
			this.canvas = $('#canvasWaveformChannel4')[0];
			this.canvasCtx = this.canvas.getContext('2d');
		},
		play: function(time, freq){
		    var oscillator = audioContext.createOscillator(), 
				amp  = audioContext.createGain(), 
				filter     = audioContext.createBiquadFilter();

			oscillator.type = 'sawtooth';
			//oscillator.frequency.value = this.startFreq;
			oscillator.frequency.setValueAtTime(freq, time);
			oscillator.frequency.exponentialRampToValueAtTime(freq , time + 0.1);

			filter.type = "lowpass";
			filter.Q.value = 10;
			filter.gain.value = 1;
			filter.frequency.setValueAtTime(1, time);
			filter.frequency.exponentialRampToValueAtTime(this.filterFreq , time + this.attack);
			filter.frequency.exponentialRampToValueAtTime(1 , time + this.attack + this.release + this.noteLength);

			amp.gain.setValueAtTime(0.001, time);
			amp.gain.exponentialRampToValueAtTime( .5, time + this.attack);
			amp.gain.exponentialRampToValueAtTime(0.001 , time + this.attack + this.release + this.noteLength);

			oscillator.connect(filter);
			filter.connect(amp);
			amp.connect(this.analyser);

			oscillator.start(time);
			oscillator.stop(time + this.attack + this.release + this.noteLength);
		}
	}
}
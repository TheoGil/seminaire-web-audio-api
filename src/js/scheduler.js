var scheduler = {
	timer: null,
	lookahead: 100,
	nextNoteTime: 0,
	currentNoteIndex: 0,

	start: function(){
		console.log("starting");
		var self = this;
		this.timer = setInterval(function(){
			self.schedule();
		}, this.lookahead)
	},

	stop: function(){
		console.log("stopping");
		clearInterval(this.timer);
		this.timer = null;
	},

	schedule: function(){
		while (this.nextNoteTime < audioContext.currentTime + this.lookahead * 0.001 ) {
			this.scheduleNote( this.currentNoteIndex, this.nextNoteTime );
			this.nextNote();
	    }
	},

	scheduleNote: function( beatNumber, time ) {
	    $('.note.current').removeClass('current');
	    $('.note[data-beat="'+beatNumber+'"]').addClass('current');
	    $('.note.active[data-beat="'+beatNumber+'"]').each(function(){
	    	var instrument = $(this).closest('.channel').attr('data-instrument');
	    	if($(this).hasClass('keyboard')){
	    		var freq = parseFloat($(this).find('.key.active').data('freq'));
	    		instruments[instrument].play(time, freq);
	    	} else {
	    		instruments[instrument].play(time);
	    	}
	    })
	},

	nextNote: function() {
	    // Advance current note and time by a 16th note...
	    var secondsPerBeat = 60.0 / bpm; // Notice this picks up the CURRENT tempo value to calculate beat length.
	    this.nextNoteTime += 0.25 * secondsPerBeat; // Add beat length to last beat time

	    this.currentNoteIndex++;    // Advance the beat number, wrap to zero
	    if (this.currentNoteIndex == 16) {
	        this.currentNoteIndex = 0;
	    }
	}
}
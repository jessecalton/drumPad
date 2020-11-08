// Element selectors
const addTrackBtn = document.getElementById('add-track-button');
const removeTrackBtn = document.getElementById('remove-track-button');
const tracks = document.querySelectorAll('.track');
const drumPadParent = document.getElementById('drum-pad');
const addInstrumentBtns = document.querySelectorAll('.instrument');
const open = document.getElementById('open');
const close = document.getElementById('close');
const modal = document.getElementById('modal');

// Set empty tracks and render them to the drum pad
sessionStorage.setItem('runningTracks', JSON.stringify([[], [], [], []]));
updateDrumPad();

// Add an empty track
function addTrack() {
  // Add the new empty track to the array of tracks in sessionStorage
  let runningTracks = JSON.parse(sessionStorage.getItem('runningTracks'));
  sessionStorage.setItem(
    'runningTracks',
    JSON.stringify(runningTracks.concat([[]]))
  );
  updateDrumPad();
}

// Removes the most recently-started track and any instruments running on it.
function removeTrack() {
  let runningTracks = JSON.parse(sessionStorage.getItem('runningTracks'));
  if (runningTracks.length === 0) {
    console.log('Cannot kill 0 tracks');
    return;
  }
  // Kill the most recent track, and store its leftover instruments
  let leftoverInstruments = runningTracks
    .splice(runningTracks.length - 1, runningTracks.length)
    .flat();
  sessionStorage.setItem('runningTracks', JSON.stringify(runningTracks));

  // Find a place for the homeless instruments, but only if both can get a track
  if (leftoverInstruments.length > 0) {
    let availableTracks = runningTracks.reduce((acc, track) => {
      if (track.length < 2) {
        return acc + 2 - track.length;
      }
      return acc;
    }, 0);
    // If not all instruments can get on a new track, they are shut down
    if (availableTracks < leftoverInstruments.length) {
      console.log('Cannot find track for instruments...');
    } else {
      leftoverInstruments.forEach((inst) => addInstrument(inst));
    }
  }
  updateDrumPad();
}

// Renders the Drum Pad with each subsequent change of the running instruments
function updateDrumPad() {
  let runningTracks = JSON.parse(sessionStorage.getItem('runningTracks'));
  drumPadParent.innerHTML = '';
  runningTracks.forEach((track, index) => {
    if (track.length === 0) {
      // If no instruments are found in a running track, create the track <div>
      // and add the `.empty` class
      let newTrack = document.createElement('div');
      newTrack.classList.add('track');
      newTrack.classList.add('empty');
      drumPadParent.appendChild(newTrack);
    } else {
      // If instruments are found, create the track <div> with the corresponding instrument info included
      track.forEach((instrument) => {
        // Create the new track element with a class of track and ID of the instrument name
        let newInstrument = document.createElement('div');
        newInstrument.classList.add('track');
        newInstrument.setAttribute('id', instrument);

        // Create <p> tags for the instrument name and track names and apply their respective classes
        let instrumentName = document.createElement('p');
        instrumentName.innerText = `${
          instrument.charAt(0).toUpperCase() + instrument.slice(1)
        }`;
        let trackName = document.createElement('p');
        trackName.innerText = `Running on track ${index + 1}`;
        instrumentName.setAttribute('class', 'instrument-name');
        trackName.setAttribute('class', 'track-name');

        // Append the <p> tags as descendants of the new track div
        newInstrument.appendChild(instrumentName);
        newInstrument.appendChild(trackName);

        // Appened the new track <div> to the track parent element
        drumPadParent.appendChild(newInstrument);
      });
    }
  });
}

// Adds an instrument to a running track when the "+" button is clicked for a corresponding instrument
function addInstrument(instName) {
  let runningTracks = JSON.parse(sessionStorage.getItem('runningTracks'));
  // Look for the first and "oldest" track running 0 instruments and add the instrument there
  for (var i = 0; i < runningTracks.length; i++) {
    if (runningTracks[i].length === 0) {
      runningTracks[i] = [instName];
      sessionStorage.setItem('runningTracks', JSON.stringify(runningTracks));
      updateDrumPad();
      return;
    }
  }
  // Otherwise, look for the first and "oldest" track running 1 instrument
  for (var i = 0; i < runningTracks.length; i++) {
    if (runningTracks[i].length === 1) {
      runningTracks[i] = runningTracks[i].concat([instName]);
      sessionStorage.setItem('runningTracks', JSON.stringify(runningTracks));
      updateDrumPad();
      return;
    }
  }
  console.log('All tracks at capacity');
}

// Removes an instrument from a running track when the instrument's corresponding "-" button is clicked
function removeInstrument(instName) {
  let runningTracks = JSON.parse(sessionStorage.getItem('runningTracks'));
  // Look for the most recent instance of that instrument
  for (var i = runningTracks.length - 1; i > -1; i--) {
    let index = runningTracks[i].indexOf(instName);
    // Sets the track to empty if the soon-to-be removed instrument is the only instrument running on that track
    if (index !== -1 && runningTracks[i].length === 1) {
      runningTracks[i] = [];
      sessionStorage.setItem('runningTracks', JSON.stringify(runningTracks));
      updateDrumPad();
      return;
      // Otherwise, only removes the one instrument
    } else if (index !== -1 && runningTracks[i].length === 2) {
      runningTracks[i].splice(index, runningTracks[i].length - 1);
      sessionStorage.setItem('runningTracks', JSON.stringify(runningTracks));
      updateDrumPad();
      return;
    }
  }
}

// Adds an empty track to the drum pad
addTrackBtn.addEventListener('click', function (e) {
  addTrack();
});

// Removes the most recent track from the drum pad
removeTrackBtn.addEventListener('click', function (e) {
  removeTrack();
});

// For each instrument, adds the corresponding styling and add/remove events for buttons
addInstrumentBtns.forEach(function (instrument) {
  var addInstrumentBtn = instrument.querySelector('button.add');
  var instName = instrument.getAttribute('id');
  addInstrumentBtn.addEventListener('click', function (e) {
    addInstrument(instName);
  });
  var removeInstrumentButton = instrument.querySelector('button.remove');
  removeInstrumentButton.addEventListener('click', function (e) {
    removeInstrument(instName);
  });
});

// Open the modal with an overlay
open.addEventListener('click', function () {
  modal.classList.add('show-modal');
});

// Close the modal when clicking the "x"
close.addEventListener('click', function () {
  modal.classList.remove('show-modal');
});

// Hide modal when clicking outside of it
window.addEventListener('click', (e) =>
  e.target === modal ? modal.classList.remove('show-modal') : false
);

// Event listener for clicking a track and marking it as "selected" (Not yet implemented)
tracks.forEach(function (track) {
  track.addEventListener('click', function (e) {
    select(track);
  });
});

// Toggles a yellow border to a selected track (not yet implemented)
function select(track) {
  track.classList.toggle('selected');
}

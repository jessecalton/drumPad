## DJ Drum Pad Controller

### Demo

https://djdrumpad.netlify.app/

### Tech Stack

- HTML
- CSS
- JavaScript

No libraries, no jQuery, just some good old-fashioned web development. 💁‍♀️

### The Scenario

This project imitates the software UI of a DJ controller or MPC (MIDI Production Controller).

### The Interface

- Each track can play up to 2 instruments.
- On initialization, 4 empty tracks are created.
- A gray box represents an empty track, where 2 instruments can be added.
- An instrument can be added to a track by clicking the "+" button next to its name.
- Similarly, an instrument can be removed from a track by clicking its corresponding "-" button.
- A track can be added by clicking the "Add Track" button.
- The most recently-added track can be stopped with the "Stop Track" button.

### The Logic

- Each new instrument will be added to the first track playing no instruments.
- If each track is playing at least 1 instrument, the next instrument will be added to the first track playing only 1 instrument.
- When stopping a track, the instruments will be added to open tracks, using the above logic.
- If a track cannot be found for all of the stopped track's instruments, they will be removed from the interface.

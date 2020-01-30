// App entry point

import m from 'mithril';
import MIDIEventReceiver from "./components/MIDI/MIDIEventReceiver";
import Mainframe from "./components/Mainframe";

MIDIEventReceiver.initialize();

// Set up routing by connecting components to routes
m.route(document.body, '/', {
  '/': Mainframe,
});

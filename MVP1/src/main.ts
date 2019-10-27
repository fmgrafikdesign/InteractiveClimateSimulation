// App entry point

import m from 'mithril';
import Home from './components/Home';
import About from './components/About';
import TerrainRenderer from "./components/Terrain/TerrainRenderer";
import MIDIEventReceiver from "./components/MIDI/MIDIEventReceiver";

MIDIEventReceiver.initialize();

// Set up routing by connecting components to routes
m.route(document.body, '/', {
  '/': TerrainRenderer,
  '/about': About
});

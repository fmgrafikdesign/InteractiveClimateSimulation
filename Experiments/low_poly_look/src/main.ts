// App entry point

import m from 'mithril';
import Home from './components/Home';
import About from './components/About';
import TerrainRenderer from "./components/Terrain/TerrainRenderer";
import InitMenu from "./components/Menus/InitMenu";
import ConfigMenu from "./components/Menus/ConfigMenu";
import MIDIEventReceiver from "./components/MIDI/MIDIEventReceiver";
import Level from "./components/Terrain/Level";

MIDIEventReceiver.initialize();

// Set up routing by connecting components to routes
m.route(document.body, '/init', {
  '/': InitMenu,
  '/about': About,
  '/generatorConfig': ConfigMenu,
  '/generatorConfig/:type': ConfigMenu,
  '/init': InitMenu,
  '/level': Level,
});

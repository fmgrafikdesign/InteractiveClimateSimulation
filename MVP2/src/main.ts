// App entry point

import m from 'mithril';
import Home from './components/Home';
import ChoseMap from './components/ChoseMap';
import TerrainRenderer from "./components/Terrain/TerrainRenderer";
import InitMenu from "./components/Menus/InitMenu";
import ConfigMenu from "./components/Menus/ConfigMenu";
import MIDIEventReceiver from "./components/MIDI/MIDIEventReceiver";
import Mainframe from "./components/Terrain/Mainframe";

MIDIEventReceiver.initialize();

// Set up routing by connecting components to routes
m.route(document.body, '/init', {
  '/': Mainframe,
  '/chose-map': ChoseMap,
  '/generatorConfig': ConfigMenu,
  '/generatorConfig/:type': ConfigMenu,
  '/init': InitMenu,
});

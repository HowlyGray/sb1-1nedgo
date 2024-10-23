import { Application } from '@nativescript/core'
import Splash from './components/Splash.svelte'

Application.run({ create: () => new Splash({ target: document.createElement('frame') }) })
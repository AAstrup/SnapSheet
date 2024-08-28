/* @refresh reload */
import { render } from 'solid-js/web'
import 'solid-devtools'

import './index.css'
import AppSnapSheet from './Apps/AppSnapSheet'

const root = document.getElementById('root')

render(() => <AppSnapSheet />, root!)

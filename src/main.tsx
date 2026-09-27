import { createRoot } from 'react-dom/client'
import Framework7 from 'framework7/bundle'
import Framework7React from 'framework7-react'
import 'framework7/css/bundle'
import 'framework7-icons/css/framework7-icons.css'
import './shared/base.css'
import Root from './Root'

Framework7.use(Framework7React)

createRoot(document.getElementById('root')!).render(
  // No StrictMode: Framework7 starts its app once and does not expect the double start of development mode
  <Root />,
)

import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import PromotionsPage from './pages/PromotionsPage'

const NotFoundPage = () => <h1>Not Found</h1>
const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={PromotionsPage} />

      <Route component={NotFoundPage} />
    </Switch>
  </Router>
)

export default App

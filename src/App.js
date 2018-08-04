import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import PromotionsPage from './pages/PromotionsPage'
import NewPromotionPage from './pages/NewPromotionPage'

const NotFoundPage = () => <h1>Not Found</h1>
const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={PromotionsPage} />
      <Route exact path="/promotions/create" component={NewPromotionPage} />

      <Route component={NotFoundPage} />
    </Switch>
  </Router>
)

export default App

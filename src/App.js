import React, { useEffect, Suspense } from 'react';
import './assets/App.css';
import Layout from './hoc/Layout'
import BurgerMaker from './containers/BurgerMaker';
import ContactData from './containers/ContactData'
import NotFound from './components/404'
import Logout from './containers/Logout'
import { Router } from '@reach/router'
import { connect } from 'react-redux'
import * as action from './store/actions'

const Checkout = React.lazy(() => {
  return import('./containers/Checkout')
})

const Orders = React.lazy(() => {
  return import('./containers/Orders')
})

const Auth = React.lazy(() => {
  return import('./containers/Auth')
})

function App (props) {
  //  Destructuring
  const { trySignIn } = props;

  useEffect(() => {
    trySignIn()
  }, [trySignIn])

  return (
    <Layout>
      <Suspense fallback={<p>Loading...</p>}>
        <Router className="w-full">
          <BurgerMaker path="/" />
          {props.isAuthenticated ? <Checkout path="checkout" >
            <ContactData path="contact-data" />
          </Checkout> : null}
          {props.isAuthenticated ? <Orders path="orders" /> : null}
          <Auth path="auth" />
          <Logout path="logout" />
          <NotFound default />
        </Router> 
      </Suspense>
    </Layout>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.token !== null
})

const mapDispatchToProps = dispatch => ({
  trySignIn: () => dispatch(action.authCheckState())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)

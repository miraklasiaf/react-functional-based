import React, { useState } from 'react'
import Auxiliary from './Auxiliary'
import Toolbar from '../components/Navigation/Toolbar'
import SideDrawer from '../components/Navigation/SideDrawer/SideDrawer'
import { connect } from 'react-redux'

function Layout (props) {
  const [isShow, setShow] = useState(false)

  const handleSideDrawerClose = () => {
    setShow(false)
  }

  const handleToggle = () => {
    setShow(!isShow)
  }

  return (
    <Auxiliary className="flex flex-col items-center w-full">
      <Toolbar toggleClicked={handleToggle} isAuth={props.isAuthenticated} />
      <SideDrawer
        isAuth={props.isAuthenticated}
        open={isShow}
        closed={handleSideDrawerClose}
      />
      <main className="w-full flex flex-col items-center mt-8">
        {props.children}
      </main>
    </Auxiliary>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.token !== null
})

export default connect(mapStateToProps)(Layout)
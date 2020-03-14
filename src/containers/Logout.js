import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import * as action from '../store/actions'
import { Redirect } from '@reach/router'

function Logout (props) {
    const { logout } = props

    useEffect(() => {
        logout()
    }, [logout])

    return <Redirect to="/" noThrow />
}

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(action.logout())
})

export default connect(null, mapDispatchToProps)(Logout)

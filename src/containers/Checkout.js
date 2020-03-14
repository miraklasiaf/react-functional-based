import React from 'react'
import CheckoutSummary from '../components/Order/CheckoutSummary'
import { connect } from 'react-redux'
import { Redirect } from '@reach/router'

function Checkout (props) {
    const handleCancel = () => {
        props.navigate("/", { replace: true })
    } 

    const handleContinue = () => {
        props.navigate("/checkout/contact-data", { replace: true})   
    }

    let summary = <Redirect to="/" />
    if(props.ingredients){
        const purchasedRedirect = props.purchased && <Redirect to="/" />
        summary = (
            <div>
                {purchasedRedirect}
                <CheckoutSummary
                    ingredients={props.ingredients}
                    cancel={handleCancel}
                    continue={handleContinue}
                />
                {props.children}
            </div>
        )
    }
    return summary
}

const mapStateToProps = state => ({
    ingredients: state.burgerMaker.ingredients,
    purchased: state.order.purchased
})


export default connect(mapStateToProps)(Checkout)
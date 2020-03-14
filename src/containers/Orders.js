import React, { useEffect } from 'react'
import Order from '../components/Order/Order'
import axios from '../axios-orders'
import Error from '../hoc/Error'
import * as action from '../store/actions'
import { connect } from 'react-redux'
import Spinner from '../components/UI/Spinner/Spinner'

function Orders (props) {
    const { fetchOrders, token, userId } = props

    useEffect(() => {
        fetchOrders(token, userId);
    }, [fetchOrders, token, userId])

    let orders = <Spinner />;
    if(!props.loading){
        orders = (
            <div className="flex flex-col items-center w-full">
                {props.orders.map(order => (
                    <Order
                        key={order.id}
                        ingredients={order.ingredients}
                        price={order.price}
                    />
                ))}
            </div>
        )
    }

    return orders
}

const mapStateToProps = state => ({
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
})

const mapDispatchToProps = dispatch => ({
    fetchOrders: (token, userId) => dispatch(action.fetchOrders(token, userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Error(Orders, axios))
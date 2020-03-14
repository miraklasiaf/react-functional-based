import React, { useState, useEffect, useCallback } from 'react'
import { navigate } from '@reach/router'
import Auxiliary from '../hoc/Auxiliary'
import Burger from '../components/Burger/Burger'
import Builder from '../components/Burger/Builder/Builder'
import Modal from '../components/UI/Modal/Modal'
import OrderSummary from '../components/Burger/OrderSummary'
import Spinner from '../components/UI/Spinner/Spinner'
import error from '../hoc/Error'
import axios from '../axios-orders'
import { useDispatch, useSelector } from 'react-redux'
import * as action from '../store/actions'

function BurgerMaker(props) {
    const [isPurchasing, setIsPurchasing] = useState(false)
    const ingredients = useSelector(state => state.burgerMaker.ingredients)
    const price = useSelector(state => state.burgerMaker.totalPrice)
    const error = useSelector(state => state.burgerMaker.error)
    const isAuth = useSelector(state => state.burgerMaker.isAuth !== null)

    const dispatch = useDispatch()
    const addIngredient = ingredientName => dispatch(action.addIngredient(ingredientName))
    const deleteIngredient = ingredientName => dispatch(action.deleteIngredient(ingredientName))
    const initIngredient = useCallback(() => dispatch(action.initIngredient()), [dispatch])
    const initPurchase = () => dispatch(action.initPurchase())
    const authRedirect = (path) => dispatch(action.authRedirect(path))

    useEffect(() => {
        initIngredient()
    }, [initIngredient]) 

    const handleContinue = () => {
        initPurchase();
        navigate("/checkout", { 
            state: {
                ingredients: ingredients,
                price: price
            } 
        })
    }

    const handleCancel = () => {
        setIsPurchasing(false)
    }

    const handlePurchasing = () => {
        if(isAuth){
            setIsPurchasing(true)
        } else {
            authRedirect('/checkout')
            navigate("/auth")
        }
    }

    const handlePurchase = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => { return ingredients[igKey] })
            .reduce((sum, el) => sum + el, 0);

        return sum > 0
    }

    const disabledInfo = { ...ingredients }

    for(let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key] <= 0
    }

    let order = null;
    let burger = error ? <p className="text-center">Ingredients can't be loaded</p> : <Spinner />


    if(ingredients){
        burger = (
            <Auxiliary>
            <Burger ingredients={ingredients} />
            <Builder
                addIngredient={addIngredient}
                removeIngredient={deleteIngredient}
                disabled={disabledInfo}
                price={price}
                isPurchase={handlePurchase(ingredients)}
                ordered={handlePurchasing}
                isAuth={isAuth}
            />
            </Auxiliary>
        );
        order = (
            <OrderSummary
                ingredients={ingredients}
                price={price}
                cancel={handleCancel}
                continue={handleContinue}
            />
        );
    }

    return (
        <Auxiliary>
            <Modal isShow={isPurchasing} isClose={handleCancel}>
                {order}
            </Modal>
            {burger}
        </Auxiliary>
    );
}

export default error(BurgerMaker, axios)
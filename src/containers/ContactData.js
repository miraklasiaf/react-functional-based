import React, { useState } from 'react'
import Button from '../components/UI/Button/Button'
import axios from '../axios-orders'
import Spinner from '../components/UI/Spinner/Spinner'
import Input from '../components/UI/Form/Input'
import { connect } from 'react-redux'
import Error from '../hoc/Error'
import * as orderAction from '../store/actions'
import { updateObject, checkValidity } from '../shared/utility'

function ContactData (props) {
    const [orderForm, setOrderForm]= useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Name'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            clicked: false
        },
        street: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Street'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            clicked: false
        },
        zipCode: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'ZIP Code'
            },
            value: '',
            validation: {
                required: true,
                minLength: 5,
                maxLength: 5
            },
            valid: false,
            clicked: false
        },
        country: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Country'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            clicked: false
        },
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Email'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            clicked: false
        },
        deliveryMethod: {
            elementType: 'select',
            elementConfig: {
                options: [
                    {value: 'fastest', displayValue: 'Fastest'},
                    {value: 'cheapest', displayValue: 'Cheapest'}
                ]
            },
            value: 'fastest',
            validation: {},
            valid: true,
        },
    })
    const [formIsValid, setFormIsValid] = useState(false)

    const handleOrder = (event) => {
        event.preventDefault();

        const formData = {};
        for(let keyIdentifier in orderForm){
            formData[keyIdentifier] = orderForm[keyIdentifier].value
        }

        const order = {
            ingredients: props.ingredients,
            price: props.price,
            orderData: formData,
            userId: props.userId
        }

        props.orderBurger(order, props.token);
    }

    const handleInputChange = (event, inputIdentifier) => {
        const newFormElement = updateObject(orderForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, orderForm[inputIdentifier].validation),
            clicked: true
        })

        const newForm = updateObject(orderForm, {
            [inputIdentifier]: newFormElement
        })

        let formIsValid = true;
        for (let inputIdentifier in newForm){
            formIsValid = newForm[inputIdentifier].valid && formIsValid
        }

        setOrderForm(newForm)
        setFormIsValid(formIsValid)
    }

        const formElementArray = []
        for (let key in orderForm){
            formElementArray.push({
                id: key,
                config: orderForm[key]
            })
        }
        let form = (
            <form onSubmit={handleOrder} className="max-w-xl w-full text-gray-100 p-4">
                {formElementArray.map(formElement => (
                    <Input 
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        key={formElement.id}
                        shouldValidate={formElement.config.validation}
                        invalid={!formElement.config.valid}
                        clicked={formElement.config.clicked}
                        changed={(event) => handleInputChange(event, formElement.id)}
                    />
                ))}
                <div className="flex flex-col">
                    <Button
                        btnType="Success"
                        clicked={handleOrder}
                        disabled={!formIsValid}
                    >ORDER</Button>
                </div>
            </form>
        );
        if(props.loading){
            form = <Spinner />
        }
        return (
            <div className="flex flex-col items-center">
                <h4 className="mt-4 text-gray-700">Enter your Contact Data</h4>
                {form}
            </div>
        )
}

const mapStateToProps = state => ({
  ingredients: state.burgerMaker.ingredients,
  price: state.burgerMaker.totalPrice,
  loading: state.order.loading,
  token: state.auth.token,
  userId: state.auth.userId
});

const mapDispatchToProps = dispatch => ({
    orderBurger: (orderData, token) => dispatch(orderAction.purchase(orderData, token))
})

export default connect(mapStateToProps, mapDispatchToProps)(Error(ContactData, axios));

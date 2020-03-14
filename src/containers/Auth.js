/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Input from '../components/UI/Form/Input';
import Button from '../components/UI/Button/Button';
import * as action from '../store/actions'
import Spinner from '../components/UI/Spinner/Spinner'
import { Redirect } from '@reach/router'
import { updateObject, checkValidity } from '../shared/utility'

function Auth (props) {
    const [authForm, setAuthForm] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Mail Address'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            clicked: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            clicked: false
        }
    })
    const [isSignup, setIsSignup] = useState(true)
    const { building, authRedirectPath, authRedirect} = props

    useEffect(() => {
        if (!building && authRedirectPath !== '/') {
            authRedirect()
        }
    }, [building, authRedirectPath, authRedirect])

    const handleInput = (event, controlName) => {
        const updatedControls = updateObject(authForm, {
            [controlName]: updateObject(authForm[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, authForm[controlName].validation),
                clicked: true
            })
        })
        setAuthForm(updatedControls)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        props.auth(authForm.email.value, authForm.password.value, isSignup);
    }

    const handleAuthMode = () => {
        setIsSignup(!isSignup)
    }

    const formElementsArray = [];
    for (let key in authForm) {
        formElementsArray.push({
            id: key,
            config: authForm[key]
        });
    }

    let form = formElementsArray.map(formElement => (
        <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            clicked={formElement.config.clicked}
            changed={(event) => handleInput(event, formElement.id)} />
    ));

    if(props.loading){
        form = <Spinner />
    }

    let errorMessage = null;

    if(props.error){
        errorMessage = (
            <p className="text-center text-lg text-gray-600">{props.error.message}</p>
        )
    }

    let redirect = null;
    if(props.isAuth){
        redirect = <Redirect to={props.authRedirectPath} noThrow />
    }

    return (
        <div className="flex px-4 py-5 text-center w-full justify-center">
            <div className="w-full flex flex-col border px-3 py-3 rounded-lg sm:w-2/3">
                {redirect}
                {errorMessage}
                <form onSubmit={handleSubmit} className="text-gray-100">
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button
                    clicked={handleAuthMode}
                    btnType="Danger">Switch to {isSignup ? 'Sign In' : 'Sign Up'}
                </Button>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    loading: state.auth.loading,
    error: state.auth.error,
    isAuth: state.auth.token !== null,
    building: state.burgerMaker.building,
    authRedirectPath: state.auth.authRedirectPath
})

const mapDispatchToProps = dispatch => ({
    auth: (email, password, isSignup) => dispatch(action.auth(email, password, isSignup)),
    authRedirect: () => dispatch(action.authRedirect("/"))
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
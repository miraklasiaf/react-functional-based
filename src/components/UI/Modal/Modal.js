import React from 'react'
import Auxiliary from '../../../hoc/Auxiliary'
import styles from './Modal.module.css'
import Backdrop from '../Backdrop/Backdrop'

function Modal (props) {
    return (
        <Auxiliary>
            <Backdrop isShow={props.isShow} clicked={props.isClose} />
            <div className={styles.Modal}
                style={{
                    transform: props.isShow ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.isShow ? '1' : '0'
                }}
            >
                {props.children}
            </div>
        </Auxiliary>
    )
}

export default React.memo(
    Modal, 
    (prevProps, nextProps) => 
        nextProps.show === prevProps.show && 
        nextProps.children === prevProps.children
)
import React from 'react'
import { ConfirmModal } from './confirm-modal'
interface Props {
 modal: string, 
 message: string,
 onConfirm: () => void   
}
export default function ModalSelector(props: Props) {
    const {modal, onConfirm} = props
    switch (modal) {
        case 'confirm':
            return <ConfirmModal onConfirm={onConfirm} message={props.message} />
        default:
            return null
    }

}

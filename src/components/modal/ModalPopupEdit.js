import React from 'react';
import { Modal } from 'antd'

function ModalPopupEdit(isVisble, isInvisible, data, title, onSubmit) {
    return (
        <>
            <Modal
                title={title}
                visible={false}
                onCancel={isInvisible}
                onOk={onSubmit}>
                <p></p>
                <>

                </>
            </Modal>
        </>
    )
}

export default ModalPopupEdit;
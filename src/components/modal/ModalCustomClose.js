import React, { useEffect, useState } from 'react';
import { Modal, } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import './modal-custom-style.scss'

const ModalCustomClose = ({ isVisible, onClose, children, background = false, className = '', style }) => {
    const [isModalVisible, setIsModalVisible] = useState(false)

    useEffect(() => {
        setIsModalVisible(isVisible)
    }, [isVisible])

    const onClickClose = () => {
        setIsModalVisible(false)
        if (onClose) onClose(false)
    }

    return (
        <Modal
            open={isModalVisible}
            footer={null}
            closable={false}
            centered
            className={` grid modal-popup-warpper ${className}`}
            bodyStyle={{
                backgroundColor: 'transparent'
            }}
        >
            <div className='close-bt-warpper'>
                <div onClick={onClickClose} className=''>
                    <CloseOutlined style={{ color: 'gray', fontSize: 18 }} />
                </div>
            </div>
            {
                background ? <div className=' body-modal'>
                    <div className="w-full h-auto">
                        {children}
                    </div>
                </div>
                    :
                    children
            }
        </Modal>
    );
};

export default ModalCustomClose;
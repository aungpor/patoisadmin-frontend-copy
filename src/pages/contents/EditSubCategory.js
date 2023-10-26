import {
    Row,
    Col,
    Card,
    Descriptions,
    Select,
    Modal,
    Radio,
    Table,
    Input,
    Form,
    Space,
    Image,
    AutoComplete,
    Tag,
    notification,
} from "antd";

import Button from "antd-button-color"
import 'antd/dist/antd.css';
import 'antd-button-color/dist/css/style.css';
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteSubCategory, getSubCategorySearchById, editSubCategory, getSubCategorySearchByName } from "../../services/content.service";
import './category.scss'

function EditSubCategory() {
    const [subCategoryData, setSubCategoryData] = useState()
    const [defaultSubCategoryName, setDefaultSubCategoryName] = useState()
    const [deleteSubCategoryModal, setDeleteSubCategoryModal] = useState(false)
    const [cantCreateSubCategoryModal, setCantCreateSubCategoryModal] = useState(false)

    let params = useParams();
    const [form] = Form.useForm();

    const fetchSubCatagory = async (subCatagoryId) => {
        const data = await getSubCategorySearchById(subCatagoryId);
        if (data) {
            const subCategory = data
            setSubCategoryData(subCategory[0].sub_category_name);
            setDefaultSubCategoryName(subCategory[0].sub_category_name)
            form.setFieldsValue({
                sub_category_name: subCategory[0].sub_category_name
            })
        }
    }

    const handleAssignSubCategory = async () => {
        const data = {
            sub_category_name: subCategoryData
        }
        const editSubCategoryRes = await editSubCategory(params.id, data)
        if (editSubCategoryRes.ResponseCode === 200) {
            notification.success({
                message: 'Save Successful',
                description: 'Edit Sub Category Successful'
            });
        }
        setDefaultSubCategoryName(subCategoryData)

    }

    const assignSubCategory = async () => {
        try {
            const checkData = await getSubCategorySearchByName(subCategoryData)
            if (subCategoryData !== defaultSubCategoryName) {
                if (checkData[0] != null && checkData[0].sub_category_name === subCategoryData) {
                    setCantCreateSubCategoryModal(true)
                }
                else {
                    handleAssignSubCategory()
                }
            }
            else {
                handleAssignSubCategory()
            }
        } catch (error) {
            notification.error({
                message: 'Save failed'
            });
        }
    }

    const showDeleteModal = () => {
        setDeleteSubCategoryModal(true);
    };

    const handleDeleteOk = async () => {
        try {
            setDeleteSubCategoryModal(false);
            const data = {
                content_sub_category_id: params.id
            }
            await deleteSubCategory(data)
            notification.success({
                message: 'Delete Successful',
                description: 'Delete Category Successful'
            });
            window.location.replace('/categories/sub-categories')
        } catch (error) {
            setDeleteSubCategoryModal(false);
            notification.error({
                message: 'Delete failed'
            });
        }
    };

    const handleDeleteCancle = () => {
        setDeleteSubCategoryModal(false);
    }

    const handleCategoryInputChange = (event) => {
        setSubCategoryData(event.target.value);
    };

    const handleCancel = () => {
        setCantCreateSubCategoryModal(false)
    };

    useEffect(() => {
        fetchSubCatagory(params.id)
    }, [])

    return (
        <>
            <Row
                gutter={[24, 0]}
                style={{ marginBottom: "15px" }}>
                <Col span={24} md={24} className="mb-24">
                    <Card
                        bordered={false}
                        className="header-solid h-full "
                        title={
                            <>
                                <Row
                                    gutter={[24, 0]}
                                    className="ant-row-flex ant-row-flex-middle"
                                >
                                    <Col xs={24} md={12}>
                                        <h6 className="font-semibold m-0">Edit Sub Category</h6>
                                    </Col>

                                </Row>
                            </>

                        }
                    >
                        <Row gutter={[24, 0]}>
                            <Col span={24} md={24} className="mb-24">
                                <Form
                                    initialValues={{
                                        remember: true,
                                    }}
                                    autoComplete="off"
                                    form={form}
                                    scrollToFirstError={true}
                                    layout="vertical"
                                >
                                    <Row gutter={[24, 0]}>
                                        <Col span={24} md={12}>
                                            <Form.Item style={{ marginBottom: "5px" }}
                                                name="sub_category_name"
                                                label='Sub Category Name'>
                                                <Input onChange={handleCategoryInputChange}>
                                                </Input>
                                            </Form.Item>
                                            <Form.Item style={{ marginTop: "30px" }}
                                            >
                                                <Button type="success" style={{ background: "rgb(96, 184, 88)", borderRadius: "10px", width: "20%" }} htmlType="submit" onClick={assignSubCategory}>
                                                    Save
                                                </Button>

                                                <Button type="lightdark" style={{ borderRadius: "10px", margin: "0 0 0 25px", width: "20%" }} htmlType="submit" onClick={() => showDeleteModal()}>
                                                    Delete
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Modal className="category delete-category" title="Delete this Sub Categories?" visible={deleteSubCategoryModal} onCancel={handleDeleteCancle} onOk={handleDeleteOk}
                    footer={[
                        <Button key="submit" type="primary"onClick={handleDeleteOk}>
                            Delete
                        </Button>,
                        <Button key="back" onClick={handleDeleteCancle}>
                            Keep
                        </Button>,
                    ]}
                >
                </Modal>
                <Modal className="category cant-create-category" title="Can't create this sub category" visible={cantCreateSubCategoryModal} onCancel={handleCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                <>
                    <p>This sub category already exists</p>
                </>
            </Modal>
        </>


    )
}

export default EditSubCategory

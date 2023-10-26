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
import { useEffect, useState, useRef } from "react";
import { getAllCatagory, getCategory, deleteCategory, getSubCategorySearchById, editCategory, assignSubCategory, getSelectSubCategory, getCategorySearchByName } from "../../services/content.service";
import './category.scss'

function EditCategory() {
    const [categoryName, setCategoryName] = useState()
    const [defaultCategoryName, setDefaultCategoryName] = useState()
    const [subCategorySelect, setSubCategorySelect] = useState([])
    const [subCategoryTag, setSubCategoryTag] = useState([])
    const [oldSubCategoryData, setOldSubCategoryData] = useState([])
    const [deleteCategoryModal, setDeleteCategoryModal] = useState(false)
    const [cantCreateCategoryModal, setCantCreateCategoryModal] = useState(false)


    let params = useParams();
    const [form] = Form.useForm();

    const setSubCategoryObjectData = (allSubCategoryObj) => {
        return {
            value: allSubCategoryObj.content_sub_category_id,
            label: allSubCategoryObj.sub_category_name
        }
    }

    const setSelectSubCategoryObject = (allSubCategoryObj) => {
        return {
            value: allSubCategoryObj.content_sub_category_id,
            label: allSubCategoryObj.sub_category_name,
            category_id: allSubCategoryObj.content_category_id
        }
    }

    const fetchCatagory = async (catagoryId) => {
        const data = await getCategory(catagoryId);
        if (data) {
            const category = data[0]
            setCategoryName(category.category_name)
            setDefaultCategoryName(category.category_name)
            form.setFieldsValue({
                category_name: category.category_name
            })
            const subCategoryArray = []
            const subCategory = category.subCategory
            for (const subCategoryObj of subCategory) {
                const SubCategoryObject = setSubCategoryObjectData(subCategoryObj)
                subCategoryArray.push(SubCategoryObject)
            }
            setSubCategoryTag(subCategoryArray)
        }
    }

    const onSelectSubCatagory = async (value) => {
        console.log(value);
        const data = await getSubCategorySearchById(value);
        if (data) {
            const subCategoryObj = data[0]
            const subCategoryObject = {
                value: subCategoryObj.content_sub_category_id,
                label: subCategoryObj.sub_category_name
            }
            setSubCategoryTag([...subCategoryTag, subCategoryObject])
            const newSubCategorySelect = subCategorySelect.filter((item) => item.value !== subCategoryObject.value);
            setSubCategorySelect(newSubCategorySelect)
        }
    }

    const handleAssignCategory = async () => {
        const dataObject = {
            category_name: categoryName
        }
        const editCategoryRes = await editCategory(params.id, dataObject)

        const oldData = oldSubCategoryData
        const newData = subCategoryTag
        const data = await getSelectSubCategory()
        if (data) {
            const isSameUser = (a, b) => a.value === b.value

            const onlyInLeft = (left, right, compareFunction) =>
                left.filter(leftValue =>
                    !right.some(rightValue =>
                        compareFunction(leftValue, rightValue)));

            const removeSubCategory = onlyInLeft(oldData, newData, isSameUser);
            const subCategorySelect = onlyInLeft(newData, oldData, isSameUser);

            removeSubCategory.map(async (item) => {
                const subCategoryTag = {
                    categoriesId: null
                }
                const assignSubCategoryRes = await assignSubCategory(item.value, subCategoryTag)
            })

            subCategorySelect.map(async (item) => {
                const subCategoryTag = {
                    categoriesId: params.id
                }
                const assignSubCategoryRes = await assignSubCategory(item.value, subCategoryTag)
            })
            setDefaultCategoryName(categoryName)

        }

        if (editCategoryRes.ResponseCode === 200) {
            notification.success({
                message: 'Save Successful',
                description: 'Edit Category Successful'
            });
        }
    }

    const assignCategory = async () => {
        try {

            const changeData = await getCategorySearchByName(categoryName);
            if (categoryName !== defaultCategoryName) {
                if (changeData[0] != null && changeData[0].category_name === categoryName) {
                    setCantCreateCategoryModal(true)
                }
                else {
                    handleAssignCategory()
                }
            }
            else {
                handleAssignCategory()
            }

        } catch (error) {
            notification.error({
                message: 'Save failed'
            });
        }
    }

    const showDeleteModal = () => {
        setDeleteCategoryModal(true);
    };

    const handleDeleteOk = async () => {
        try {
            setDeleteCategoryModal(false);
            const data = {
                content_category_id: params.id
            }
            await deleteCategory(data)
            notification.success({
                message: 'Delete Successful',
                description: 'Delete Category Successful'
            });
            window.location.replace('/categories')
        } catch (error) {
            setDeleteCategoryModal(false);
            notification.error({
                message: 'Delete failed'
            });
        }
    };

    const handleDeleteCancle = () => {
        setDeleteCategoryModal(false);
    }

    const init = async () => {
        const data = await getCategory(params.id);
        const allSubCategories = await getSelectSubCategory()
        if (data) {
            const category = data[0]
            setCategoryName(category.category_name)
            setDefaultCategoryName(category.category_name)
            form.setFieldsValue({
                category_name: category.category_name
            })
            const subCategoryArray = []
            for (const subCategoryObj of category.subCategory) {
                const SubCategoryObject = {
                    value: subCategoryObj.content_sub_category_id,
                    label: subCategoryObj.sub_category_name
                }
                subCategoryArray.push(SubCategoryObject)
            }
            setSubCategoryTag(subCategoryArray)
            setOldSubCategoryData(subCategoryArray)

            const allSubCategoryArray = []
            for (const allSubCategoryObj of allSubCategories) {
                const SubCategoryObject = {
                    value: allSubCategoryObj.content_sub_category_id,
                    label: allSubCategoryObj.sub_category_name,
                    category_id: allSubCategoryObj.content_category_id
                }
                allSubCategoryArray.push(SubCategoryObject)
            }
            const allSubCategory = allSubCategoryArray.filter((item) => item.category_id == null);

            const isSameUser = (a, b) => a.value === b.value
            const onlyInLeft = (left, right, compareFunction) =>
                left.filter(leftValue =>
                    !right.some(rightValue =>
                        compareFunction(leftValue, rightValue)));

            const selectSubCategory = onlyInLeft(allSubCategory, subCategoryArray, isSameUser);

            setSubCategorySelect(selectSubCategory)
        }
    }

    const handleCategoryInputChange = (event) => {
        setCategoryName(event.target.value);
    };

    const handleCloseTag = (subCategory) => {
        const newTags = subCategoryTag.filter((tag) => tag.value !== subCategory.value);
        setSubCategoryTag(newTags);
        console.log(subCategory);

        const addSelect = {
            value: subCategory.value,
            label: subCategory.label,
            category_id: subCategory.value
        }

        setSubCategorySelect([...subCategorySelect, addSelect])
        form.setFieldsValue({
            subCategory: undefined
        })
    };

    const handleCancel = () => {
        setCantCreateCategoryModal(false)
    };

    useEffect(() => {
        init()
        fetchCatagory(params.id)
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
                                        <h6 className="font-semibold m-0">Edit Category</h6>
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
                                                name="category_name"
                                                label='Category Name'>
                                                <Input onChange={handleCategoryInputChange}>
                                                </Input>
                                            </Form.Item>
                                            <Form.Item style={{ marginBottom: "10px" }}
                                                name="subCategory"
                                                label='Sub Category'>
                                                <Select
                                                    placeholder="Add Sub Category"
                                                    size={"large"}
                                                    style={{ width: "100%" }}
                                                    onChange={onSelectSubCatagory}
                                                    options={subCategorySelect}
                                                >
                                                </Select>
                                            </Form.Item>
                                            <div className="category">
                                                {subCategoryTag.map((subCategory, index) => {
                                                    return (
                                                        <Tag key={subCategory.value} closable
                                                            onClose={() => handleCloseTag(subCategory)}
                                                        >
                                                            {subCategory.label}
                                                        </Tag>
                                                    );
                                                })}
                                            </div>
                                            <Form.Item style={{ marginTop: "10px" }}
                                            >
                                                <Button type="success" style={{ background: "rgb(96, 184, 88)", borderRadius: "10px", width: "20%" }} htmlType="submit" onClick={assignCategory}>
                                                    Save
                                                </Button>

                                                <Button type="danger" style={{ borderRadius: "10px", margin: "0 0 0 25px", width: "20%" }} htmlType="submit" onClick={() => showDeleteModal()}>
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

            <Modal className="category delete-category" title="Delete this Categories?" visible={deleteCategoryModal} onCancel={handleDeleteCancle} onOk={handleDeleteOk}
                footer={[
                    <Button key="submit" type="primary" onClick={handleDeleteOk}>
                        Delete
                    </Button>,
                    <Button key="back" onClick={handleDeleteCancle}>
                        Keep
                    </Button>,
                ]}
            >
            </Modal>

            <Modal className="category cant-create-category" title="Can't edit this category" visible={cantCreateCategoryModal} onCancel={handleCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                <>
                    <p>This category already exists</p>
                </>
            </Modal>
        </>


    )
}

export default EditCategory
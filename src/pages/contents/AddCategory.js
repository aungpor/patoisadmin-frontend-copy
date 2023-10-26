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
    notification
} from "antd";

import {
    PlusOutlined,
    ExclamationOutlined,
    ExclamationCircleOutlined,
    PlusCircleOutlined,
    CloudDownloadOutlined,
    DeleteOutlined,
    QrcodeOutlined,
    CopyOutlined,
    CheckSquareOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getCategorySearchByName, getAllCatagory, getSubCatagory, getSelectSubCategory, getSubCategorySearchById, addCategory, assignSubCategory, addSubCategory } from "../../services/content.service";
import Button from "antd-button-color"
import 'antd/dist/antd.css';
import 'antd-button-color/dist/css/style.css';
import './category.scss'

function AddCategory() {
    const [categoryData, setCategoryData] = useState([])
    const [subCategoryTag, setSubCategoryTag] = useState([])
    const [subCategorySelect, setSubCategorySelect] = useState([])
    const [selectCategoryStatus, setSelectCategoryStatus] = useState(true)
    const [selectCategoryValue, setSelectCategoryValue] = useState()
    const [createCategoryModal, setcreateCategoryModal] = useState(false)
    const [cantCreateCategoryModal, setCantCreateCategoryModal] = useState(false)
    const [createSubCategoryModal, setcreateSubCategoryModal] = useState(false)
    const [cantCreateSubCategoryModal, setCantCreateSubCategoryModal] = useState(false)
    const [subCategoryDisable, setSubCategoryDisable] = useState(true)
    const [categoryInputValue, setCategoryInputValue] = useState('');
    const [subCategoryInputValue, setSubCategoryInputValue] = useState('');
    const [oldSubCategoryData, setOldSubCategoryData] = useState([])
    const [form] = Form.useForm();

    const fetchAllCatagory = async () => {
        const data = await getAllCatagory()
        const optionArr = data.map((item) => {
            return {
                value: item.content_category_id,
                label: item.category_name
            }
        })
        setCategoryData(optionArr)
    }

    const fetchSubCatagoryTag = async (catagoryId) => {
        const data = await getSubCatagory(catagoryId)
        const optionArr = data.map((item) => {
            return {
                value: item.content_sub_category_id,
                label: item.sub_category_name
            }
        })
        setOldSubCategoryData(optionArr)
        setSubCategoryTag(optionArr)
    }

    const setSelectSubCategoryObject = (allSubCategoryObj) => {
        return {
            value: allSubCategoryObj.content_sub_category_id,
            label: allSubCategoryObj.sub_category_name,
            category_id: allSubCategoryObj.content_category_id
        }
    }

    const fetchSubCatagorySelect = async () => {
        const data = await getSelectSubCategory()
        if (data) {
            const allSubCategories = data
            const nullArray = []
            for (const allSubCategoryObj of allSubCategories) {
                const SubCategoryObject = setSelectSubCategoryObject(allSubCategoryObj)
                nullArray.push(SubCategoryObject)
            }
            const nullSubCategory = nullArray.filter((item) => item.category_id == null);

            const isSameUser = (a, b) => a.content_sub_category_id === b.value
            const onlyInLeft = (left, right, compareFunction) =>
                left.filter(leftValue =>
                    !right.some(rightValue =>
                        compareFunction(leftValue, rightValue)));

            const onlyInA = onlyInLeft(nullSubCategory, subCategoryTag, isSameUser);
            const onlyInB = onlyInLeft(subCategoryTag, nullSubCategory, isSameUser);

            const result = [...onlyInA, ...onlyInB];
            const optionArr = result.map((item) => {
                return {
                    value: item.content_sub_category_id,
                    label: item.sub_category_name
                }
            })
            setSubCategorySelect(onlyInA)
        }
    }

    const handleCloseTag = (removedTag) => {
        const newTags = subCategoryTag.filter((tag) => tag.value !== removedTag.value);
        setSubCategoryTag(newTags);

        const addSelect = {
            value: removedTag.value,
            label: removedTag.label,
            category_id: null
        }

        setSubCategorySelect([...subCategorySelect, addSelect])

        form.setFieldsValue({
            subCategory: undefined
        })
    };

    const onSelectCatagory = async (value, label) => {
        if (value) {
            setSelectCategoryStatus(false)
        }
        setSelectCategoryValue(value)
        setSubCategoryDisable(false)
        await fetchSubCatagoryTag(value)
        await fetchSubCatagorySelect()
        form.setFieldsValue({
            subCategory: undefined
        })
    }

    const onSelectSubCatagory = async (value) => {
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

    const showCategoryModal = async (catagoryName) => {
        const data = await getCategorySearchByName(catagoryName);
        if (data[0] != null) {
            const category = data[0]
            if (category.category_name === catagoryName) {
                setCantCreateCategoryModal(true)
            }
            else {
                setcreateCategoryModal(true);
            }
        }
        else {
            setcreateCategoryModal(true);
        }

    };

    const handleCancel = () => {
        setcreateCategoryModal(false);
        setCantCreateCategoryModal(false)
        setcreateSubCategoryModal(false);
        setCantCreateSubCategoryModal(false)
    };

    const handleCategoryOk = async () => {

        try {
            const data = {
                category_name: categoryInputValue,
                category_desc: categoryInputValue,
                create_by: 0,
                update_by: 0
            }
            const addCategoryRes = await addCategory(data)
            if (addCategoryRes.ResponseCode === 200) {
                notification.success({
                    className: "category",
                    message: 'Add Category',
                    description: 'Add Category Successful'
                });
                setCategoryInputValue("");
                form.setFieldsValue({
                    category_name: ""
                })
            }
            setcreateCategoryModal(false);
            fetchAllCatagory()

        } catch (error) {
            setcreateCategoryModal(false);
            notification.error({
                message: 'Add Category failed'
            });
        }
    }

    const showSubCategoryModal = async (subCatagoryName) => {
        const data = await getSubCategorySearchById(subCatagoryName);
        if (data[0] != null) {
            const subCategory = data[0]
            if (subCategory.sub_category_name === subCatagoryName) {
                setCantCreateSubCategoryModal(true)
            }
            else {
                setcreateSubCategoryModal(true);
            }
        }
        else {
            setcreateSubCategoryModal(true);
        }
    };

    const handleSubCategoryOk = async () => {
        try {
            setcreateSubCategoryModal(false);

            const data = {
                sub_category_name: subCategoryInputValue,
                sub_category_desc: subCategoryInputValue,
                active: 1,
                create_by: 0,
                update_by: 0
            }
            const addCategoryRes = await addSubCategory(data)
            if (addCategoryRes.ResponseCode === 200) {
                notification.success({
                    className: "category",
                    message: 'Add Sub Category',
                    description: 'Add Sub Category Successful'
                });
            }

            setSubCategoryInputValue("");
            form.setFieldsValue({
                sub_category_name: ""
            })
            fetchSubCatagorySelect()
        } catch (error) {
            setcreateSubCategoryModal(false);
            notification.error({
                message: 'Add Sub Category failed'
            });
        }
    }

    const handleAssignSubCategory = async () => {
        try {
            setcreateSubCategoryModal(false);

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
                        categoriesId: selectCategoryValue
                    }
                    const assignSubCategoryRes = await assignSubCategory(item.value, subCategoryTag)
                })
            }

            notification.success({
                className: "category",
                message: 'Save Successful',
                description: 'Assign Sub Category Successful'
            });
        } catch (error) {
            setcreateSubCategoryModal(false);
            notification.error({
                message: 'Save failed'
            });
        }
    }

    const handleCategoryInputChange = (event) => {
        setCategoryInputValue(event.target.value);
    };

    const handleSubCategoryInputChange = (event) => {
        setSubCategoryInputValue(event.target.value);
    };

    useEffect(() => {
        fetchAllCatagory()
        fetchSubCatagorySelect()
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
                                        <h6 className="font-semibold m-0">Add Category</h6>
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
                                            <Form.Item
                                                label="Category Name"
                                                name="category_name"
                                                style={{ marginBottom: "20px" }}
                                            >
                                                <Input
                                                    onChange={handleCategoryInputChange}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                            >
                                                <Button className="add-category" type="success" style={{ borderRadius: "10px ", width: "20%" }} htmlType="submit"
                                                    disabled={!categoryInputValue}
                                                    onClick={() => showCategoryModal(categoryInputValue)}>
                                                    Add
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
                                        <h6 className="font-semibold m-0">Add Sub Category</h6>
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
                                            <Form.Item
                                                label="Sub Category Name"
                                                name="sub_category_name"
                                                style={{ marginBottom: "20px" }}
                                            >
                                                <Input
                                                    onChange={handleSubCategoryInputChange}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                            >
                                                <Button type="success" style={{ borderRadius: "10px", width: "20%" }} htmlType="submit"
                                                    disabled={!subCategoryInputValue}
                                                    onClick={() => showSubCategoryModal(subCategoryInputValue)}>
                                                    Add
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
                                        <h6 className="font-semibold m-0">Assign Sub Category</h6>
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
                                                name="Category"
                                                label='Category'>
                                                <Select
                                                    placeholder="Add Category"
                                                    size={"large"}
                                                    style={{ width: "100%" }}
                                                    onChange={onSelectCatagory}
                                                    options={categoryData}
                                                >
                                                </Select>
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
                                                    disabled={subCategoryDisable}
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

                                            <Form.Item
                                            >
                                                <Button className="add-category" type="success" style={{ borderRadius: "10px", margin: "10px 0 0 0", width: "20%" }}
                                                    disabled={selectCategoryStatus}
                                                    htmlType="submit" onClick={handleAssignSubCategory}>
                                                    Save
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

            <Modal className="category create-category" title="Confirm Create Category" visible={createCategoryModal} onCancel={handleCancel} onOk={handleCategoryOk} cancelText="Close">
                <>
                    <p>Press confirm to create this category</p>
                </>
            </Modal>

            <Modal className="category cant-create-category" title="Can't create this category" visible={cantCreateCategoryModal} onCancel={handleCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                <>
                    <p>This category already exists</p>
                </>
            </Modal>

            <Modal className="category create-category" title="Confirm Create Sub Category" visible={createSubCategoryModal} onCancel={handleCancel} onOk={handleSubCategoryOk} cancelText="Close">
                <>
                    <p>Press confirm to create this sub category</p>
                </>
            </Modal>

            <Modal className="category cant-create-category" title="Can't create this sub category" visible={cantCreateSubCategoryModal} onCancel={handleCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                <>
                    <p>This sub category already exists</p>
                </>
            </Modal>
        </>
    )
}

export default AddCategory
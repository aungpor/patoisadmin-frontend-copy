import {
    Row,
    Col,
    Card,
    Table,
    Input,
    Modal,
    Tag,
    Popover,
    notification,
} from "antd";
import {
    PlusOutlined,
    MoreOutlined,
    DeleteOutlined,
    EditOutlined
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom";
import { deleteSubCategory, getSubCategorySearch } from "../../services/content.service";
import Button from "antd-button-color"
import 'antd/dist/antd.css';
import 'antd-button-color/dist/css/style.css';
import './category.scss'
const { Search } = Input;

function SubCategories() {
    const [subCategoryData, setSubCategoryData] = useState([])
    const [subCategoryName, setSubCategoryName] = useState()
    const [selectCategory, setSelectCategory] = useState()
    const [subCategoryModal, setCategoryModal] = useState(false)
    const [deleteSubCategoryModal, setDeleteSubCategoryModal] = useState(false)
    const [deleteSubCategoryId, setDeleteSubCategoryId] = useState()
    const [value, setValue] = useState("")
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10
        },
    })

    const fetchAllSubCatagory = async (input) => {
        const subCategoryArray = [];
        const data = await getSubCategorySearch(tableParams, input);
        if (data) {
            const subCategories = data.data;
            let count = (tableParams.pagination.current - 1) * 10
            for (const subCategoryObj of subCategories) {
                count++
                const subCategoryObject = await setSubCategoryObjectData(subCategoryObj, count);
                subCategoryArray.push(subCategoryObject);


            }
        }
        setSubCategoryData(subCategoryArray);

        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                total: data?.total,
            },
        });
    }

    const setSubCategoryObjectData = async (subCategory, count) => {
        return {
            key: subCategory.content_sub_category_id,
            index: count,
            sub_category_id: subCategory.content_sub_category_id,
            sub_category_name: subCategory.sub_category_name,
            content_assignment: subCategory.content_assignment,
            categories_assignment: subCategory.categories_assignment

        }
    }

    const showCategoryModal = (categoryId, subCategoryName, categories_assignment) => {
        setCategoryModal(true);
        setSubCategoryName(subCategoryName)
        setSelectCategory(categories_assignment)
    };
    const handleCategoryCancel = () => {
        setCategoryModal(false);
    };

    const showDeleteModal = (sub_category_id) => {
        setDeleteSubCategoryModal(true);
        setDeleteSubCategoryId(sub_category_id)
    };

    const handleDeleteOk = async () => {
        try {
            setDeleteSubCategoryModal(false);
            const data = {
                content_sub_category_id: deleteSubCategoryId
            }
            await deleteSubCategory(data)
            fetchAllSubCatagory(value)
            notification.success({
                className: "category",
                message: 'Delete Successful',
                description: 'Delete Sub Category Successful'
            });
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

    const content = (sub_category_id) => {
        return (
            <div className="category-popover">
                <p><Link to={`edit-sub-category/${sub_category_id}`}><EditOutlined />  Edit</Link></p>
                <a onClick={() => showDeleteModal(sub_category_id)}><p><DeleteOutlined />  Delete</p></a>
            </div>
        )
    }

    const columns = [
        {
            title: "No.",
            dataIndex: "index",
            key: "index",
        },
        {
            title: "Sub Category ID",
            dataIndex: "sub_category_id",
            key: "sub_category_id",
        },
        {
            title: "Sub Category Name",
            dataIndex: "sub_category_name",
            key: "sub_category_name",
            width: '30%',
        },
        {
            title: "Content Assignment",
            dataIndex: "content_assignment",
            key: "content_assignment",
        },
        {
            title: "Category Assignment",
            dataIndex: "action",
            key: "action",
            render: (__, { content_sub_category_id, sub_category_name, categories_assignment }) => {
                return (
                    <>
                        <div className="ant-employed">
                            <>
                                <a onClick={() => showCategoryModal(content_sub_category_id, sub_category_name, categories_assignment)}>View Category</a>

                            </>
                        </div>
                    </>
                )
            },
        },
        {
            key: "action",
            title: "",
            dataIndex: "action",
            render: (__, { sub_category_id }) => {
                return (
                    <>
                        <div className="ant-employed">
                            <Popover content={content(sub_category_id)} trigger="click">
                                <a><MoreOutlined /></a>
                            </Popover>

                        </div>
                    </>
                )
            },
        },
    ]

    const handleFetchSubCate = (event) => {
        if (event.length > 0) {
            setTableParams({pagination: {
                current: 1,
                pageSize: 10
            },})
            setValue(event)
            fetchAllSubCatagory(event)
        }
        else {
            setValue("")
            fetchAllSubCatagory("")
        }
    }

    const onChange = (pagination) => {
        setTableParams({ pagination })
    };

    const categoryTag = () => {
        if (selectCategory == null) {

        }
        else {
            return (
                <Tag key={selectCategory}>
                    {selectCategory}
                </Tag>
            )
        }

    }

    useEffect(() => {
        fetchAllSubCatagory(value)
    }, [JSON.stringify(tableParams)])

    return (
        <>
            <div className="tabled category">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className=" criclebox tablespace mb-24"
                            title="Sub Categories"
                            extra={
                                <>

                                    {/* <Button class="categories ant-btn ant-btn-primary" ghost type="success" style={{ color: "rgb(96, 184, 88)", background: "rgb(255, 255, 255)", borderRadius: "10px", }} >
                                        Download CSV
                                    </Button> */}
                                    <a href="/categories/add-category">
                                        <Button class="categories ant-btn ant-btn-primary" type="success" style={{ background: "rgb(96, 184, 88)", borderRadius: "10px" }} >
                                            <PlusOutlined />Add Category
                                        </Button></a>

                                </>
                            }
                        >
                            <div className="category-search">
                                <Search
                                    placeholder="Sub Categories Name, ID"
                                    enterButton="Search"
                                    onSearch={handleFetchSubCate}
                                    className="subCategories"
                                    allowClear
                                    style={{
                                        width: "100%",
                                    }}
                                />


                            </div>



                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={subCategoryData}
                                    // pagination={false}
                                    pagination={tableParams.pagination}
                                    onChange={onChange}
                                    className="ant-border-space"
                                />
                            </div>

                            <div className="category-footer">
                                <p><Link to={'/categories'}>All Categories</Link></p>
                            </div>
                        </Card>


                    </Col>
                </Row>

                <Modal className="category" title="Sub Categories" visible={subCategoryModal} onCancel={handleCategoryCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                    <p>{subCategoryName}</p>
                    <>
                        {categoryTag()}
                    </>
                </Modal>

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

            </div>


        </>
    )
}

export default SubCategories
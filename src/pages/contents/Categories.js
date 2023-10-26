import {
    Row,
    Col,
    Card,
    Table,
    Input,
    Modal,
    Tag,
    Popover,
    notification
} from "antd";
import {
    PlusOutlined,
    MoreOutlined,
    DeleteOutlined,
    EditOutlined
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom";
import { deleteCategory, getSubCatagory, getCategorySearch } from "../../services/content.service";
import Button from "antd-button-color"
import 'antd/dist/antd.css';
import 'antd-button-color/dist/css/style.css';
import './category.scss'
const { Search } = Input;

function Categories() {
    const [categoryData, setCategoryData] = useState([])
    const [subCategoryData, setSubCategoryData] = useState([])
    const [subCategoryModal, setSubCategoryModal] = useState(false)
    const [categoryName, setCategoryName] = useState()
    const [deleteCategoryModal, setDeleteCategoryModal] = useState(false)
    const [value, setValue] = useState("")
    const [deleteCategoryId, setDeleteCategoryId] = useState()
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10
        },
    })

    const showSubCategoryModal = (categoryId, categoryName) => {
        setSubCategoryModal(true);
        setCategoryName(categoryName)
        fetchSubCategory(categoryId)

    };
    const handleSubCategoryCancel = () => {
        setSubCategoryModal(false);
    };

    const showDeleteModal = (category_id) => {
        setDeleteCategoryModal(true);
        setDeleteCategoryId(category_id)
    };

    const handleDeleteOk = async () => {
        try {
            setDeleteCategoryModal(false);
            const data = {
                content_category_id: deleteCategoryId
            }
            await deleteCategory(data)
            fetchCategory(value)
            notification.success({
                className: "category",
                message: 'Delete Successful',
                description: 'Delete Category Successful'
            });
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

    const content = (category_id) => {
        return (
            <div className="category-popover">
                <p><Link to={`categories/edit-category/${category_id}`}><EditOutlined />  Edit</Link></p>
                <a onClick={() => showDeleteModal(category_id)}><p><DeleteOutlined />  Delete</p></a>
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
            title: "Category ID",
            dataIndex: "category_id",
            key: "category_id",
        },
        {
            title: "Category Name",
            dataIndex: "category_name",
            key: "category_name",
            width: '30%',
        },
        {
            title: "Sub Category Amount",
            dataIndex: "sub_category_amount",
            key: "sub_category_amount",
        },
        {
            title: "Sub Category List",
            dataIndex: "action",
            key: "action",
            render: (__, { category_id, category_name }) => {
                return (
                    <>
                        <div className="ant-employed">
                            <>
                                <a onClick={() => showSubCategoryModal(category_id, category_name)}>View Sub Category</a>

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
            render: (__, { category_id }) => {
                return (
                    <>
                        <div className="ant-employed">
                            <Popover content={content(category_id)} trigger="click">
                                <a><MoreOutlined /></a>
                            </Popover>

                        </div>
                    </>
                )
            },
        },
    ]
    
    const fetchSubCategory = async (categoryId) => {
        const SubCategoryArray = []
        const data = await getSubCatagory(categoryId)
        if (data) {
            const subCategories = data
            for (const subCategoryObj of subCategories) {
                SubCategoryArray.push(subCategoryObj)
            }
        }
        setSubCategoryData(SubCategoryArray)
    }

    const fetchCategory = async (input) => {
        const CategoryArray = [];
        const data = await getCategorySearch(tableParams, input);
        if (data) {
            const categories = data.data;
            let count = (tableParams.pagination.current - 1) * 10
            for (const categoryObj of categories) {
                count++
                const categoryObject = await setSearchCategoryObj(categoryObj, count);
                CategoryArray.push(categoryObject);
            } 
        }
        setCategoryData(CategoryArray);
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                total: data?.total,
            },
        });
    }

    const setSearchCategoryObj = async (category, count) => {

        return {
            key: category.content_category_id,
            index: count,
            category_id: category.content_category_id,
            category_name: category.category_name,
            category_desc: category.category_desc,
            sub_category_amount: category.subCategoryAmount,
            sub_category: category.subCategory

        }
    }

    const onChange = (pagination) => {
        setTableParams({ pagination})
    };

    const handleFetchCate = (event) => {
        if (event.length > 0) {
            setTableParams({pagination: {
                current: 1,
                pageSize: 10
            },})
            setValue(event)
            fetchCategory(event)
        }
        else{
            setValue("")
            fetchCategory("")
        }
    }

    useEffect(() => {
        fetchCategory(value)
    }, [JSON.stringify(tableParams)])

    return (
        <>
            <div className="tabled category">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Categories"
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
                                    placeholder="input search text"
                                    enterButton="Search"
                                    onSearch={handleFetchCate}
                                    className="categories"
                                    allowClear
                                    style={{
                                        width: "100%",
                                    }}
                                />


                            </div>

                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={categoryData}
                                    pagination={tableParams.pagination}
                                    onChange={onChange}
                                    className="ant-border-space"
                                />
                            </div>

                            <div className="category-footer">
                                <p><Link to={'categories/sub-categories'}>All Sub Categories</Link></p>
                            </div>
                        </Card>


                    </Col>
                </Row>

                <Modal className="category" title="Sub Categories" visible={subCategoryModal} onCancel={handleSubCategoryCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                    <p>{categoryName}</p>
                    <>
                        {subCategoryData.map((subCategory, index) => {
                            return (
                                <Tag key={index}>
                                    {subCategory.sub_category_name}
                                </Tag>
                            );
                        })}
                    </>
                </Modal>

                <Modal className="category delete-category" title="Delete this Categories?" visible={deleteCategoryModal} onCancel={handleDeleteCancle} onOk={handleDeleteOk}
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

export default Categories
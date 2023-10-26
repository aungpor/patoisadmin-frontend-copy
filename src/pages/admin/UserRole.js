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
    Select
} from "antd";
import {
    PlusOutlined,
    MoreOutlined,
    DeleteOutlined,
    EditOutlined
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom";
import { getAllUser, getUserRole, getUserByPage, searchUser } from "../../services/role.service";
import Button from "antd-button-color"
import 'antd/dist/antd.css';
import 'antd-button-color/dist/css/style.css';
const { Search } = Input;

function UserRole() {
    const [userData, setUserData] = useState([])
    const [roleData, setRoleData] = useState([])
    const [roleModal, setRoleModal] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10
        },
    })

    const setUserObject = async (userObj, count) => {
        return {
            index: count,
            user_id: userObj.user_id,
            user_name: userObj.user_name,
            user_email: userObj.user_email
        }
    }

    const fetchUser = async (input) => {
        const userArray = []
        const data = await searchUser(tableParams, input);
        if (data) {
            const users = data.data;
            let count = 1
            for (const userObj of users) {
                const userObject = await setUserObject(userObj, count++);
                userArray.push(userObject);
            }
        }
        setUserData(userArray);
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                total: data?.total,
            },
        });
    }

    const fetchRole = async (userId) => {
        const roleArray = []
        const data = await getUserRole(userId);
        if (data) {
            const roles = data;
            for (const roleObj of roles) {
                const roleObject = {
                    role_name: roleObj.role_name
                }
                roleArray.push(roleObject);
            }
        }
        setRoleData(roleArray);
    }

    const showRoleModal = (userId) => {
        setRoleModal(true);
        fetchRole(userId)

    };
    const handleRoleCancel = () => {
        setRoleModal(false);
    };

    const handleFetchSearch = (event) => {
        if (event.length > 0) {
            setTableParams({pagination: {
                current: 1,
                pageSize: 10
            },})
            setSearchValue(event)
            fetchUser(event)
        }
        else{
            setSearchValue("")
            fetchUser("")
        }
    }

    const columns = [
        {
            title: "No.",
            dataIndex: "index",
            key: "index",
        },
        {
            title: "User ID",
            dataIndex: "user_id",
            key: "user_id",
        },
        {
            title: "Email",
            dataIndex: "user_email",
            key: "user_email",
        },
        {
            title: "Name",
            dataIndex: "user_name",
            key: "user_name",

        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (__, { user_id }) => {
                return (
                    <>
                        <div className="ant-employed">
                            <>
                                <a onClick={() => showRoleModal(user_id)}>View Role</a>

                            </>
                        </div>
                    </>
                )
            },
        },
        {
            key: "action",
            title: "Action",
            dataIndex: "action",
            render: (__, { user_id }) => {
                return (
                    <>
                        <Button><Link to={`/user-role/edit-user-role/${user_id}`}>Edit</Link></Button>

                    </>
                )
            },
        },
    ]

    const onChange = (pagination) => {
        setTableParams({ pagination })
    };

    useEffect(() => {
        fetchUser(searchValue)
    }, [JSON.stringify(tableParams)])

    return (
        <>
            <div className="tabled category">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="User"
                            extra={
                                <>
                                    <a href="/user-role/add-user">
                                        <Button class="categories ant-btn ant-btn-primary" type="success" style={{ background: "rgb(96, 184, 88)", borderRadius: "10px" }} >
                                            <PlusOutlined />Add User
                                        </Button></a>

                                </>
                            }
                        >
                            <div className="role-search">
                                <Search
                                    placeholder="input search text"
                                    enterButton="Search"
                                    onSearch={handleFetchSearch}
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
                                    dataSource={userData}
                                    pagination={tableParams.pagination}
                                    onChange={onChange}
                                    className="ant-border-space"
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Modal className="category" title="Role" visible={roleModal} onCancel={handleRoleCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                <>
                    {roleData.map((role, index) => {
                        return (
                            <Tag key={index}>
                                {role.role_name}
                            </Tag>
                        );
                    })}
                </>
            </Modal>

        </>
    )
}

export default UserRole
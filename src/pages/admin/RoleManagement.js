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
import { getAllRole, getPermissionByRoleId, deleteRole, deleteAssignRole, checkDeleteAssignRole } from "../../services/role.service";
import Button from "antd-button-color"
import 'antd/dist/antd.css';
import 'antd-button-color/dist/css/style.css';
const { Search } = Input;

function RoleManagement() {
    const [roleData, setRoleData] = useState([])
    const [roleName, setRoleName] = useState('')
    const [permissionData, setPermissionData] = useState([])
    const [permissionModal, setPermissionModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [cantDeleteModal, setCantDeleteModal] = useState(false)
    const [superAdminModal, setSuperAdminModal] = useState(false)
    const [selectRoleId, setSelectRoleId] = useState()
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10
        },
    })

    const setRoleObject = async (roleObj, count) => {
        return {
            index: count,
            role_id: roleObj.role_id,
            role_name: roleObj.role_name
        }
    }

    const fetchRole = async () => {
        const roleArray = []
        const data = await getAllRole();
        if (data) {
            const roles = data;
            let count = 1
            for (const roleObj of roles) {
                const roleObject = await setRoleObject(roleObj, count++);
                roleArray.push(roleObject);
            }
        }
        setRoleData(roleArray);
    }

    const fetchPermission = async (roleId) => {
        const permissionArray = []
        const data = await getPermissionByRoleId(roleId)
        if (data) {
            const permissions = data
            for (const permissionObj of permissions) {
                permissionArray.push(permissionObj)
            }
        }
        setPermissionData(permissionArray)
    }

    const content = (role_id) => {
        return (
            <div className="category-popover">
                <p><Link to={`role-management/edit-role/${role_id}`}><EditOutlined />  Edit</Link></p>
                <a onClick={() => showDeleteModal(role_id)}><p><DeleteOutlined />  Delete</p></a>
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
            title: "Role ID",
            dataIndex: "role_id",
            key: "role_id",

        },
        {
            title: "Role",
            dataIndex: "role_name",
            key: "role_name",
            // width: '30%',
        },
        {
            title: "Permission List",
            dataIndex: "action",
            key: "action",
            render: (__, { role_name, role_id }) => {
                return (
                    <>
                        <div className="ant-employed">
                            <>
                                <a onClick={() => showModal(role_name, role_id)}>View Permission</a>
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
            render: (__, { role_id }) => {
                return (
                    <>
                        <div className="ant-employed">
                            <Popover content={content(role_id)} trigger="click">
                                <a><MoreOutlined /></a>
                            </Popover>

                        </div>
                    </>
                )
            },
        },
    ]

    const onChange = (pagination) => {
        setTableParams({ pagination })
    };

    const showModal = (role_name, role_id) => {
        setPermissionModal(true);
        fetchPermission(role_id)
        setRoleName(role_name)

    };
    const handleModalCancel = () => {
        setPermissionModal(false);
        setDeleteModal(false)
        setCantDeleteModal(false)
        setSuperAdminModal(false)
    };

    const showDeleteModal = async (role_id) => {
        if (role_id == "1") {
            setSuperAdminModal(true)
        }
        else {
            const data = await checkDeleteAssignRole(role_id)
            if (data.length != 0) {
                setCantDeleteModal(true)
            }
            else {
                setDeleteModal(true)
                setSelectRoleId(role_id)
            }
        }


    }

    const handleDeleteOk = async () => {
        try {
            setDeleteModal(false);
            const data = {
                role_id: selectRoleId
            }
            await deleteRole(data)

            await deleteAssignRole(data)
            notification.success({
                message: 'Delete Successful',
                description: 'Delete Role Successful'
            });
            fetchRole()
        } catch (error) {
            setDeleteModal(false);
            notification.error({
                message: 'Delete failed'
            });
        }
    };

    useEffect(() => {
        fetchRole()
    }, [])

    return (
        <>
            <div className="tabled category">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Role Management"
                            extra={
                                <>
                                    <a href="/role-management/add-role">
                                        <Button class="categories ant-btn ant-btn-primary" type="success" style={{ background: "rgb(96, 184, 88)", borderRadius: "10px" }} >
                                            <PlusOutlined />Add Role
                                        </Button></a>

                                </>
                            }
                        >

                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={roleData}
                                    pagination={tableParams.pagination}
                                    onChange={onChange}
                                    className="ant-border-space"
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Modal className="category" title="permission" visible={permissionModal} onCancel={handleModalCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                <p>{roleName}</p>
                <>
                    {permissionData.map((permission, index) => {
                        return (
                            <Tag key={index}>
                                {permission.permission_name}
                            </Tag>
                        );
                    })}
                </>
            </Modal>

            <Modal className="category delete-category" title="Delete this Role?" visible={deleteModal} onCancel={handleModalCancel} onOk={handleDeleteOk}
                footer={[
                    <Button key="submit" type="primary" onClick={handleDeleteOk}>
                        Delete
                    </Button>,
                    <Button key="back" onClick={handleModalCancel}>
                        Keep
                    </Button>,
                ]}
            >
            </Modal>

            <Modal className="category cant-role-modal" title="Can't delete this role" visible={cantDeleteModal} onCancel={handleModalCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                <>
                    <p>this role already assigned to the user. </p>
                </>
            </Modal>

            <Modal className="category cant-role-modal" title="Can't delete this role" visible={superAdminModal} onCancel={handleModalCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                <>
                    <p>Can't delete super admin. </p>
                </>
            </Modal>
        </>
    )
}

export default RoleManagement
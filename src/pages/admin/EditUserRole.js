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
    Checkbox,
    Divider,
} from "antd";
import {
    CloseOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react"
import { Link, useParams } from "react-router-dom";
import { getUserById, getRoleById, getUserRole, getAllRole, editAssignRole, checkAssignRole, assignUserRole, getPermissionByRoleId, getUserByEmail, editUser, deleteUser } from "../../services/role.service";
import Button from "antd-button-color"
import 'antd/dist/antd.css';
import 'antd-button-color/dist/css/style.css';

function EditUserRole() {
    const [userData, setUserData] = useState({})
    const [roleSelect, setRoleSelect] = useState([])
    const [roleTable, setRoleTable] = useState([])
    const [oldRoleData, setOldRoleData] = useState([])
    const [permissionData, setPermissionData] = useState([])
    const [permissionModal, setPermissionModal] = useState(false)
    const [cantAddUserModal, setCantAddUserModal] = useState(false)
    const [deleteUserModal, setDeleteUserModal] = useState(false)
    const [emailInputValue, setEmailInputValue] = useState('')
    const [userNameInputValue, setuserNameInputValue] = useState('')
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10
        },
    })

    let params = useParams();
    const [form] = Form.useForm();

    const fetchUser = async () => {
        const data = await getUserById(params.id)
        if (data) {
            const user = data
            setUserData(user)
            setuserNameInputValue(user.user_name)
            setEmailInputValue(user.user_email)
            form.setFieldsValue({
                name: user.user_name,
                email: user.user_email
            })
        }
    }

    const fetchRoleSelect = async (userId) => {
        const roleArray = []
        const allRoledata = await getAllRole();
        if (allRoledata) {
            for (const roleObj of allRoledata) {
                const roleObject = {
                    value: roleObj.role_id,
                    label: roleObj.role_name
                }
                roleArray.push(roleObject);

            }
        }

        const data = await getUserRole(userId)
        if (data) {
            const userRole = []
            for (const roleObj of data) {
                const roleObject = {
                    value: roleObj.role_id,
                    label: roleObj.role_name
                }
                userRole.push(roleObject)
            }

            const isSameUser = (a, b) => a.value === b.value
            const onlyInLeft = (left, right, compareFunction) =>
                left.filter(leftValue =>
                    !right.some(rightValue =>
                        compareFunction(leftValue, rightValue)));

            const roleSelectData = onlyInLeft(roleArray, userRole, isSameUser);
            setRoleSelect(roleSelectData)

            const result = roleArray.filter(o1 => userRole.some(o2 => o1.value === o2.value));
            setOldRoleData(result)
            setRoleTable(result)
        }
    }

    const onSelectRole = async (value) => {
        const data = await getRoleById(value);
        if (data) {
            const role = data
            const roleObject = {
                value: role.role_id,
                label: role.role_name
            }
            setRoleTable([...roleTable, roleObject])
            const newRoleSelect = roleSelect.filter((item) => item.value !== roleObject.value);
            setRoleSelect(newRoleSelect)
        }
    }

    const handleCloseTag = (value, label) => {
        const newTags = roleTable.filter((tag) => tag.value !== value);
        setRoleTable(newTags);

        const addSelect = {
            value: value,
            label: label,
            category_id: null
        }

        setRoleSelect([...roleSelect, addSelect])

        form.setFieldsValue({
            Role: undefined
        })
    };

    const handleAssignRole = async () => {
        try {
            const oldData = oldRoleData
            const newData = roleTable
            const isSameUser = (a, b) => a.value === b.value

            const onlyInLeft = (left, right, compareFunction) =>
                left.filter(leftValue =>
                    !right.some(rightValue =>
                        compareFunction(leftValue, rightValue)));

            const roleRemove = onlyInLeft(oldData, newData, isSameUser);
            const roleAdd = onlyInLeft(newData, oldData, isSameUser);

            roleRemove.map(async (item) => {
                const assignBody = {
                    user_id: params.id,
                    role_id: item.value,
                    active: "0"
                }
                const assignAssignRoleRes = await editAssignRole(assignBody)
            })

            roleAdd.map(async (item) => {
                const data = await checkAssignRole(params.id, item.value)
                if (data == null) {
                    const newAssign = {
                        user_id: params.id,
                        role_id: item.value,
                        active: "1"
                    }
                    const assignRoleRes = await assignUserRole(newAssign)
                }
                else {
                    const oldAssign = {
                        user_id: params.id,
                        role_id: item.value,
                        active: "1"
                    }
                    const editAssignRoleRes = await editAssignRole(oldAssign)
                }
            })

            fetchRoleSelect(params.id)
        }
        catch (error) {
            notification.error({
                message: 'Save failed'
            });
        }
    }

    const handleEditUser = async () => {
        try {
            const userRes = await getUserByEmail(emailInputValue)
            const data = {
                user_id: userData.user_id,
                newEmail: emailInputValue,
                newName: userNameInputValue,
                active:1
            }
            if (emailInputValue !== userData.user_email) {
                if (userRes != null && userRes.user_email === emailInputValue) {
                    setCantAddUserModal(true)
                }
                else {
                    await editUser(data)
                    await handleAssignRole()
                    notification.success({
                        message: 'Save Successful',
                        description: 'Assign Role Successful'
                    });
                    setTimeout(() => {
                        window.location.replace('/user-role')
                    }, 1000)
                }
            }
            else {
                await editUser(data)
                await handleAssignRole()
                notification.success({
                    message: 'Save Successful',
                    description: 'Assign Role Successful'
                });
                setTimeout(() => {
                    window.location.replace('/user-role')
                }, 1000)
            }


        } catch (error) {
            notification.error({
                message: 'Save failed'
            });
        }
    }

    const handleDeleteOk = async () => {
        try {
            setDeleteUserModal(false);
            const data = {
                user_id: params.id
            }
            await deleteUser(data)
            notification.success({
                message: 'Delete Successful',
                description: 'Delete User Successful'
            });
            window.location.replace('/user-role')
        } catch (error) {
            setDeleteUserModal(false);
            notification.error({
                message: 'Delete failed'
            });
        }
    };

    const columns = [
        {
            title: "Role ID",
            dataIndex: "value",
            key: "value",

        },
        {
            title: "Role",
            dataIndex: "label",
            key: "label",
            // width: '30%',
        },
        {
            title: "Permission List",
            dataIndex: "action",
            key: "action",
            render: (__, { value, label }) => {
                return (
                    <>
                        <div className="ant-employed">
                            <>
                                <a onClick={() => showPermissionModal(value, label)}>View Permission</a>
                            </>
                        </div>
                    </>
                )
            },
        },
        {
            title: "action",
            dataIndex: "action",
            key: "action",
            render: (__, { value, label }) => {
                return (
                    <>
                        <div className="ant-employed">
                            <>
                                <a onClick={() => handleCloseTag(value, label)}><CloseOutlined /></a>

                            </>
                        </div>
                    </>
                )
            },
        },
    ]

    const fetchPermission = async (role_id) => {
        const permissionArray = []
        const data = await getPermissionByRoleId(role_id)
        if (data) {
            const permissions = data
            for (const permissionObj of permissions) {
                permissionArray.push(permissionObj)
            }
        }
        setPermissionData(permissionArray)
    }

    const onChange = (pagination) => {
        setTableParams({ pagination })
    };

    const showPermissionModal = (value, label) => {
        setPermissionModal(true);
        fetchPermission(value)

    };

    const showDeleteUserModal = (value, label) => {
        setDeleteUserModal(true)

    };

    const handleModalCancel = () => {
        setPermissionModal(false);
        setCantAddUserModal(false)
        setDeleteUserModal(false)
    };

    const handleEmailInputChange = (event) => {
        setEmailInputValue(event.target.value);
    };

    const handleUserNameInputChange = (event) => {
        setuserNameInputValue(event.target.value);
    };

    useEffect(() => {
        fetchUser()
        fetchRoleSelect(params.id)
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
                                        <h6 className="font-semibold m-0">Edit User Role</h6>
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
                                                name="email"
                                                label=' Email'>
                                                <Input
                                                    onChange={handleEmailInputChange}
                                                >
                                                </Input>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[24, 0]}>
                                        <Col span={24} md={12}>
                                            <Form.Item style={{ marginBottom: "5px" }}
                                                name="name"
                                                label=' Name'>
                                                <Input
                                                    onChange={handleUserNameInputChange}
                                                >
                                                </Input>
                                            </Form.Item>
                                        </Col>
                                    </Row>


                                    <Form.Item style={{ marginBottom: "10px" }}
                                        name="Role"
                                        label='Assign Role'>
                                        <Select
                                            placeholder="Select Role"
                                            size={"large"}
                                            style={{ width: "100%" }}
                                            onChange={onSelectRole}
                                            options={roleSelect}
                                        >
                                        </Select>
                                    </Form.Item>

                                    <Form.Item style={{ marginTop: "10px" }}>
                                        <Row gutter={[24, 24]}>
                                            {
                                                <Col span={24}>
                                                    <div className="table-responsive">
                                                        <Table
                                                            columns={columns}
                                                            dataSource={roleTable}
                                                            pagination={tableParams.pagination}
                                                            onChange={onChange}
                                                            className="ant-border-space"
                                                        />
                                                    </div>
                                                </Col>
                                            }
                                        </Row>
                                    </Form.Item>

                                    <Form.Item style={{ marginTop: "10px" }}>
                                        <Button type="success" style={{ borderRadius: "10px", width: "66px" }} htmlType="submit"
                                            // disabled={!roleInputValue}
                                            // onClick={handleAssignRole}
                                            onClick={handleEditUser}
                                        >
                                            Save
                                        </Button>
                                        <Button type="danger" style={{ borderRadius: "10px", margin: "0 0 0 25px", width: "66px" }} htmlType="submit"
                                            // disabled={!roleInputValue}
                                            // onClick={handleAssignRole}
                                            onClick={showDeleteUserModal}
                                        >
                                            Delete
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Modal className="category" title="permission" visible={permissionModal} onCancel={handleModalCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                {/* <p>{roleName}</p> */}
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
            <Modal className="category cant-create-category" title="Can't Edit This User" visible={cantAddUserModal} onCancel={handleModalCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                <p>This user already exists</p>
            </Modal>
            <Modal className="category delete-category" title="Delete this User?" visible={deleteUserModal} onCancel={handleModalCancel} onOk={handleDeleteOk}
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
        </>
    )
}

export default EditUserRole
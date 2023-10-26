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
    CloseOutlined,
} from "@ant-design/icons";

import { useEffect, useState } from "react";
import { getAllUser, getAllRole, getUserRole, getRoleById, assignUserRole, editAssignRole, checkAssignRole, getPermissionByRoleId, addUser, getUserByEmail, checkInActiveUserByEmail, editUser } from "../../services/role.service";
import Button from "antd-button-color"
import 'antd/dist/antd.css';
import 'antd-button-color/dist/css/style.css';
import { async } from "q";

function AddUser() {
    const [roleTable, setRoleTable] = useState([])
    const [roleSelect, setRoleSelect] = useState([])
    const [permissionData, setPermissionData] = useState([])
    const [permissionModal, setPermissionModal] = useState(false)
    const [cantAddUserModal, setCantAddUserModal] = useState(false)
    const [addUserModal, setAddUserModal] = useState(false)
    const [emailInputValue, setEmailInputValue] = useState('')
    const [userNameInputValue, setuserNameInputValue] = useState('')
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10
        },
    })
    const [form] = Form.useForm();

    const fetchRole = async () => {
        const roleArray = []
        const data = await getAllRole();
        if (data) {
            const roles = data;
            for (const roleObj of roles) {
                const roleObject = {
                    value: roleObj.role_id,
                    label: roleObj.role_name
                }
                roleArray.push(roleObject);
            }
        }
        setRoleSelect(roleArray)
    }

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

    const handleCloseTable = (value, label) => {
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

    const showUserModal = async () => {
        const checkUser = await getUserByEmail(emailInputValue)
        if (checkUser == null) {
            setAddUserModal(true)
        }
        else {
            setCantAddUserModal(true)
        }
    }

    const handleAddUser = async () => {
        try {
            const newUserData = {
                user_name: userNameInputValue,
                user_email: emailInputValue,
                active: 1
            }
            const checkInActive = await checkInActiveUserByEmail(emailInputValue)
            if (checkInActive == null) {
                const newUser = await addUser(newUserData)
                roleTable.map(async (item) => {
                    const data = await checkAssignRole(newUser.user_id, item.value)
                    if (data == null) {
                        const newAssign = {
                            user_id: newUser.user_id,
                            role_id: item.value,
                            active: "1"
                        }
                        const assignRoleRes = await assignUserRole(newAssign)
                    }
                    else {
                        const oldAssign = {
                            user_id: newUser.user_id,
                            role_id: item.value,
                            active: "1"
                        }
                        const editAssignRoleRes = await editAssignRole(oldAssign)
                    }

                })
            }
            else {
                const editUserData = {
                    user_id: checkInActive.user_id,
                    newEmail: emailInputValue,
                    newName: userNameInputValue,
                    active: 1
                }
                const editUserRes = await editUser(editUserData)
                roleTable.map(async (item) => {
                    const data = await checkAssignRole(editUserRes.user_id, item.value)
                    const newAssign = {
                        user_id: editUserRes.user_id,
                        role_id: item.value,
                        active: "1"
                    }
                    const assignRoleRes = await assignUserRole(newAssign)

                })
            }

            setAddUserModal(false)
            fetchRole()
            setEmailInputValue("")
            setuserNameInputValue("")
            form.setFieldsValue({
                email: "",
                name: ""
            })
            notification.success({
                message: 'Save Successful',
                description: 'Add User Successful'
            });
            setTimeout(() => {
                window.location.replace('/user-role')
            }, 1000)




        } catch (error) {
            // setcreateSubCategoryModal(false);
            console.log(error);
            notification.error({
                message: 'Save failed'
            });
        }
    }

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
                                <a onClick={() => handleCloseTable(value, label)}><CloseOutlined /></a>

                            </>
                        </div>
                    </>
                )
            },
        },
    ]

    const showPermissionModal = (value, label) => {
        setPermissionModal(true);
        fetchPermission(value)
    };

    const handleModalCancel = () => {
        setPermissionModal(false);
        setCantAddUserModal(false)
        setAddUserModal(false)
    };

    const handleEmailInputChange = (event) => {
        setEmailInputValue(event.target.value);
    };

    const handleUserNameInputChange = (event) => {
        setuserNameInputValue(event.target.value);
    };

    const onChange = (pagination) => {
        setTableParams({ pagination })
    };

    useEffect(() => {
        fetchRole()
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
                                        <h6 className="font-semibold m-0">Add User</h6>
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

                                    <Row gutter={[24, 0]}>
                                        <Col span={24} md={12}>
                                            <Form.Item style={{ marginBottom: "10px" }}
                                                name="Role"
                                                label='Role'>
                                                <Select
                                                    placeholder="Select Role"
                                                    size={"large"}
                                                    style={{ width: "100%" }}
                                                    onChange={onSelectRole}
                                                    options={roleSelect}
                                                >
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>

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

                                    <Form.Item>
                                        <Button type="success" style={{ borderRadius: "10px", margin: "10px 0 0 0", width: "10%" }}
                                            htmlType="submit" onClick={showUserModal} disabled={emailInputValue == '' || userNameInputValue == ''}
                                        >
                                            Save
                                        </Button>
                                    </Form.Item>

                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Modal className="category" title="permission" visible={permissionModal} onCancel={handleModalCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
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

            <Modal className="category cant-create-category" title="Can't Create This User" visible={cantAddUserModal} onCancel={handleModalCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                <p>This user already exists</p>
            </Modal>

            <Modal className="category role-modal" title="Confirm Create User" visible={addUserModal} onCancel={handleModalCancel} onOk={handleAddUser} cancelText="Close">
                <>
                    <p>Press confirm to create this user</p>
                </>
            </Modal>
        </>
    )
}

export default AddUser
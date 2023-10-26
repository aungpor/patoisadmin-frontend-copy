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
import { useState, useEffect, useRef } from "react"
import { Link, useParams } from "react-router-dom";
import { getAllPermission, addRole, getRoleByName, assignRolePermission, editRole, getAllPermissionGroup } from "../../services/role.service";
import Button from "antd-button-color"
import 'antd/dist/antd.css';
import 'antd-button-color/dist/css/style.css';

function AddRole() {
    const [roleInputValue, setRoleInputValue] = useState('')
    const [permissionValue, setPermissionValue] = useState([])
    const [permissionOption, setPermissionOption] = useState([]) //ข้อมูล permission ทั้งหมด และสถานะ role_id
    const [createRoleModal, setCreateRoleModal] = useState(false)
    const [cantCreateRoleModal, setCantCreateRoleModal] = useState(false)
    const [form] = Form.useForm();

    const fetchPermission = async () => {
        const permissionGroupArray = []
        const groupData = await getAllPermissionGroup()
        if (groupData) {
            const permissionGroup = groupData
            for (const permissionGrouptObj of permissionGroup) {
                if (permissionGrouptObj.permission_group_code != 6) {
                    const permissionGrouptObject = {
                        groupCode: permissionGrouptObj.permission_group_code,
                        groupName: permissionGrouptObj.permission_group_name,
                        item: []
                    }
                    permissionGroupArray.push(permissionGrouptObject)
                }

            }
        }

        const permissionArray = []
        const permissionData = await getAllPermission()
        if (permissionData) {
            const permissions = permissionData
            for (const permissionObj of permissions) {
                const permissionObject = {
                    label: permissionObj.permission_name,
                    value: permissionObj.permission_id,
                    group: permissionObj.permission_group_code
                }
                permissionArray.push(permissionObject)
            }
        }

        for (const permissionGroupObj of permissionGroupArray) {
            for (const permissionObj of permissionArray) {
                if (permissionGroupObj.groupCode == permissionObj.group) {
                    permissionGroupObj.item.push(permissionObj)
                }
            }
        }

        setPermissionOption(permissionGroupArray)
    }

    const showRoleModal = async (roleName) => {
        const data = await getRoleByName(roleName)
        if (data != null) {
            if (data.active == false) {
                setCreateRoleModal(true);
            }
            else {
                setCantCreateRoleModal(true)
            }
        }
        else {
            setCreateRoleModal(true);
        }
    }

    const handleCancel = () => {
        setCreateRoleModal(false);
        setCantCreateRoleModal(false)
    };

    const handleRoleOk = async () => {
        try {
            const roleData = {
                role_name: roleInputValue,
                active: 1
            }
            const addRoleRes = await addRole(roleData)
            permissionValue.map(async (permissionObj) => {
                const permissionData = {
                    role_id: addRoleRes.role_id,
                    permission_id: permissionObj
                }
                await assignRolePermission(permissionData)
            })

            if (addRoleRes) {
                notification.success({
                    message: 'Add Role',
                    description: 'Add Role Successful'
                });
                setRoleInputValue("")
                form.setFieldsValue({
                    role_name: ""
                })
            }
            setCreateRoleModal(false);
            form.setFieldsValue({
                permission: []
            })
            setTimeout(() => {
                window.location.replace('/role-management')
            }, 1000)
        } catch (error) {
            setCreateRoleModal(false);
            notification.error({
                message: 'Add Role failed'
            });
            console.log(error);
        }
    }

    const handleCategoryInputChange = (event) => {
        setRoleInputValue(event.target.value);
    };

    const onChange = (checkedValues) => {
        setPermissionValue(checkedValues)
    };

    useEffect(() => {
        fetchPermission()
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
                                        <h6 className="font-semibold m-0">Add Role</h6>
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
                                                name="role_name"
                                                label=' Name'>
                                                <Input
                                                    onChange={handleCategoryInputChange}>
                                                </Input>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item style={{ marginTop: "10px" }}>
                                        <Row gutter={[24, 24]}>
                                            {
                                                <Col span={24}>
                                                    <Card className="card-billing-info" bordered="false">
                                                        <div className="col-info">
                                                            <Form.Item style={{ marginTop: "10px" }}
                                                                name="permission"
                                                            >
                                                                <Checkbox.Group
                                                                    style={{
                                                                        width: '100%',
                                                                    }}
                                                                    onChange={onChange}
                                                                >
                                                                    {
                                                                        permissionOption.map((group) =>
                                                                            <>

                                                                                <h1 style={{ textAlign: "left" }}>
                                                                                    {group.groupName}</h1>
                                                                                <Divider />
                                                                                <Row>
                                                                                    {group.item.map((permission) =>
                                                                                        <Col span={8}>
                                                                                            <Checkbox
                                                                                                value={permission.value}
                                                                                            >
                                                                                                {permission.label}
                                                                                            </Checkbox>
                                                                                        </Col>)
                                                                                    }
                                                                                </Row>
                                                                                <Divider />


                                                                            </>
                                                                        )
                                                                    }
                                                                </Checkbox.Group>
                                                            </Form.Item>

                                                        </div>
                                                    </Card>
                                                </Col>
                                            }
                                        </Row>
                                    </Form.Item>

                                    <Form.Item style={{ marginTop: "10px" }}>
                                        <Button type="success" style={{ borderRadius: "10px", width: "66px" }} htmlType="submit"
                                            disabled={!roleInputValue}
                                            onClick={() => showRoleModal(roleInputValue)}
                                        >
                                            Add
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Modal className="category role-modal" title="Confirm Create Role" visible={createRoleModal} onCancel={handleCancel} onOk={handleRoleOk} cancelText="Close">
                <>
                    <p>Press confirm to create this role</p>
                </>
            </Modal>

            <Modal className="category cant-role-modal" title="Can't create this role" visible={cantCreateRoleModal} onCancel={handleCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                <>
                    <p>This role already exists</p>
                </>
            </Modal>
        </>
    )
}

export default AddRole
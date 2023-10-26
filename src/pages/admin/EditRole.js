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
import { getAllPermission, editRole, getRoleByName, assignRolePermission, getRoleById, deleteRole, getPermissionByRoleId, checkRolePermission, editRolePermission, getAllPermissionGroup, checkDeleteAssignRole } from "../../services/role.service";
import Button from "antd-button-color"
import 'antd/dist/antd.css';
import 'antd-button-color/dist/css/style.css';
import ShopApproval from "../shop/ShopApproval";

function EditRole() {
    const [defaultRoleName, setDefaultRoleName] = useState('')
    const [roleInputValue, setRoleInputValue] = useState('')
    const [permissionValue, setPermissionValue] = useState([])
    const [permissionOption, setPermissionOption] = useState([]) //ข้อมูล permission ทั้งหมด และสถานะ role_id
    const [createRoleModal, setCreateRoleModal] = useState(false)
    const [cantDeleteModal, setCantDeleteModal] = useState(false)
    const [superAdminModal, setSuperAdminModal] = useState(false)
    const [cantEditModal, setCantEditModal] = useState(false)
    const [cantCreateRoleModal, setCantCreateRoleModal] = useState(false)
    const [defaultPermissionValue, setDefaultPermissionValue] = useState([]) // permission ที่เป็นของ role นี้
    const [deleteModal, setDeleteModal] = useState(false)

    let params = useParams();
    const [form] = Form.useForm();

    const fetchRole = async () => {
        const data = await getRoleById(params.id)
        if (data) {
            const role = data
            setDefaultRoleName(role.role_name)
            form.setFieldsValue({
                role_name: role.role_name
            })
            setRoleInputValue(role.role_name)
        }
    }

    const fetchPermission = async () => {
        const permissionGroupArray = []
        const data = await getAllPermissionGroup()
        if (data) {
            const permissionGroup = data
            if (params.id == "1") { // ถ้าเป็น role super admin 
                for (const permissionGrouptObj of permissionGroup) {
                    const permissionGrouptObject = {
                        groupCode: permissionGrouptObj.permission_group_code,
                        groupName: permissionGrouptObj.permission_group_name,
                        item: []

                    }
                    permissionGroupArray.push(permissionGrouptObject)
                }
            }
            else {
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

        }

        const permissionArray = []
        const defaultPermissionValueArray = []
        const permissionFieldValue = []
        const allPermissionData = await getAllPermission()
        if (allPermissionData) {
            for (const permissionObj of allPermissionData) {
                const permissionObject = {
                    label: permissionObj.permission_name,
                    value: permissionObj.permission_id,
                    group: permissionObj.permission_group_code
                }
                permissionArray.push(permissionObject)
            }
        }
        const rolePermissiontData = await getPermissionByRoleId(params.id)
        if (rolePermissiontData) {
            for (const permissionObj of rolePermissiontData) {
                defaultPermissionValueArray.push(permissionObj.permission_id)
                permissionFieldValue.push(permissionObj.permission_id)
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
        setDefaultPermissionValue(defaultPermissionValueArray)
        setPermissionValue(defaultPermissionValueArray)

        form.setFieldsValue({
            permission: permissionFieldValue
        })
    }

    const showRoleModal = async (roleName) => {
        const data = await getRoleByName(roleName)
        if (roleInputValue !== defaultRoleName) {
            if (data != null && data.role_name === roleInputValue) {
                setCantCreateRoleModal(true)
            }
            else {
                setCreateRoleModal(true);
            }
        }
        else {
            setCreateRoleModal(true);
        }
    }

    const handleModalCancel = () => {
        setCreateRoleModal(false);
        setCantCreateRoleModal(false)
        setDeleteModal(false)
        setCantDeleteModal(false)
        setSuperAdminModal(false)
        setCantEditModal(false)
    };

    const handleRoleOk = async () => {
        try {
            const roleData = {
                role_id: params.id,
                role_name: roleInputValue,
                active: 1
            }
            const editRoleRes = await editRole(roleData)

            const isSameUser = (a, b) => a === b
            const onlyInLeft = (left, right, compareFunction) =>
                left.filter(leftValue =>
                    !right.some(rightValue =>
                        compareFunction(leftValue, rightValue)));

            const permissionAdd = onlyInLeft(permissionValue, defaultPermissionValue, isSameUser);
            const permissionRemove = onlyInLeft(defaultPermissionValue, permissionValue, isSameUser);

            permissionAdd.map(async (permissionObj) => {

                const permissionData = {
                    role_id: editRoleRes.role_id,
                    permission_id: permissionObj,
                    active: 1
                }
                const checkRolePermissionRes = await checkRolePermission(permissionData.role_id, permissionData.permission_id)
                if (checkRolePermissionRes) {
                    const res = await editRolePermission(permissionData)
                }
                else {
                    const res = await assignRolePermission(permissionData)
                }

            })

            permissionRemove.map(async (permissionObj) => {
                const permissionData = {
                    role_id: editRoleRes.role_id,
                    permission_id: permissionObj,
                    active: 0
                }
                const res = await editRolePermission(permissionData)
            })

            if (editRoleRes) {
                notification.success({
                    message: 'Add Role',
                    description: 'Add Role Successful'
                });
                // setRoleInputValue("")
            }
            setDefaultRoleName(roleInputValue)
            setCreateRoleModal(false);
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

    const showDeleteModal = async () => {
        if (params.id == "1") {
            setSuperAdminModal(true)
        }
        else {
            const data = await checkDeleteAssignRole(params.id)
            if (data.length != 0) {
                setCantDeleteModal(true)
            }
            else {
                setDeleteModal(true)
            }
        }
    }

    const handleDeleteOk = async () => {
        try {
            setDeleteModal(false);
            const data = {
                role_id: params.id
            }
            await deleteRole(data)
            notification.success({
                message: 'Delete Successful',
                description: 'Delete Role Successful'
            });
            window.location.replace('/role-management')
        } catch (error) {
            setDeleteModal(false);
            notification.error({
                message: 'Delete failed'
            });
        }
    };

    const handleCategoryInputChange = (event) => {
        setRoleInputValue(event.target.value);
    };

    const onChange = (checkedValues) => {
        setPermissionValue(checkedValues)
    };

    useEffect(() => {
        fetchRole()
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
                                        <h6 className="font-semibold m-0">Edit Role</h6>
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
                                            Save
                                        </Button>

                                        <Button type="danger" style={{ borderRadius: "10px", margin: "0 0 0 10px", width: "66px" }} htmlType="submit"
                                            onClick={() => showDeleteModal()}>
                                            Delete
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Modal className="category role-modal" title="Confirm Edit Role" visible={createRoleModal} onCancel={handleModalCancel} onOk={handleRoleOk} cancelText="Close">
                <>
                    <p>Press confirm to Edit this role</p>
                </>
            </Modal>

            <Modal className="category cant-role-modal" title="Can't Edit this role" visible={cantCreateRoleModal} onCancel={handleModalCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                <>
                    <p>This role already exists</p>
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

            <Modal className="category cant-role-modal" title="Can't Edit this role" visible={cantEditModal} onCancel={handleModalCancel} cancelText="Close" okButtonProps={{ style: { display: 'none' } }}>
                <>
                    <p>Can't Edit super admin. </p>
                </>
            </Modal>
        </>
    )
}

export default EditRole
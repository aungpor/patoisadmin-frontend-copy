import {
    Row,
    Col,
    Card,
    Button,
    Descriptions,
    Select,
    Modal,
    Radio,
    Table,
} from "antd";
import { ExclamationCircleOutlined, CloseOutlined, CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getManualUserByUserIdService, updateUserService } from "../../services/user.service";
import { useParams } from "react-router-dom";

const { Option } = Select;


const pencil = [
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        key={0}
    >
        <path
            d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
            className="fill-gray-7"
        ></path>
        <path
            d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
            className="fill-gray-7"
        ></path>
    </svg>,
];


function ReferralUserByUserId() {
    let params = useParams();
    const [userData, setUserData] = useState({});
    const [editUserData, setEditUserData] = useState({});
    const [activeData, setActiveData] = useState();
    const [isEdit, setIsEdit] = useState(false);

    const getUserByUserId = async (userId) => {
        const user = await getManualUserByUserIdService(userId);
        console.log("user: ", user);
        if (user) {
            setUserData(user);
        }

    }

    const confirm = () => {
        Modal.confirm({
            title: 'ยืนยันการแก้ไขข้อมูลผู้ใช้งาน',
            icon: <ExclamationCircleOutlined />,
            // content: 'ยืนยันการแก้ไขข้อมูลร้าน',
            okText: 'บันทึก',
            cancelText: 'ยกเลิก',
            onOk() {
                handleEditUser();
                // handleSaveStatusShop()
            },
        });
    };

    const handleEditChange = () => {
        setIsEdit(true);
        setEditUserData(userData);
        // setEditButton("บันทึก");


    }

    const handleEditCancel = () => {
        setIsEdit(false);
    }

    const handleEditUser = () => {
        const editedUser = userData;
        editedUser.active = activeData ? activeData : userData.active;
        const responseEditedUser = updateUserService(editedUser);
        if (responseEditedUser) {
            setIsEdit(false);
        }
    }

    const handleSubmit = (value) => {
        console.log(`selected ${value}`);
        // setIsStatusEdit(true);
        // setShopStastusCode(value);
    };


    useEffect(() => {
        getUserByUserId(params.id);
    }, [])

    return (
        <>
            <Row gutter={[24, 0]}>
                <Col span={24} md={24} className="mb-24">
                    <Card
                        className="header-solid h-full"
                        bordered={false}
                        title={[<h6 className="font-semibold m-0">Referral User Detail</h6>]}
                        bodyStyle={{ paddingTop: "0" }}
                    >
                        <Row gutter={[24, 24]}>
                            {userData &&
                                <Col span={24}>
                                    <Card className="card-billing-info" bordered="false">
                                        <div className="col-info">
                                            <Descriptions>
                                                <Descriptions.Item label="ID" span={3}>
                                                    {userData.id}
                                                </Descriptions.Item>

                                                <Descriptions.Item label="Name" span={3}>
                                                    {userData.name}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Email" span={3}>
                                                    {userData.email}
                                                </Descriptions.Item>

                                                <Descriptions.Item label="Tel" span={3}>
                                                    {userData.tel}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="provider" span={3}>
                                                    {userData.provider}
                                                </Descriptions.Item>

                                                <Descriptions.Item label="Referral Code" span={3}>
                                                    {userData.user_code}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Status" span={3}>
                                                    {userData.active &&
                                                        <Select disabled={!isEdit} defaultValue={userData.active} style={{ width: 120 }} onChange={(event) => {
                                                            setActiveData(event);
                                                        }}>
                                                            <Option value="1">Active</Option>
                                                            <Option value="0">Inactive</Option>
                                                        </Select>
                                                    }

                                                </Descriptions.Item>
                                            </Descriptions>
                                        </div>
                                        {
                                            isEdit &&
                                            (
                                                <>
                                                    <div className="col-action">
                                                        <Button style={{ color: "red" }} type="link" className="darkbtn" onClick={() => handleEditCancel()}>
                                                            <CloseCircleOutlined />ยกเลิก
                                                        </Button>
                                                    </div>
                                                    <div className="col-action">
                                                        <Button style={{ color: "green" }} type="link" className="darkbtn" onClick={() => confirm()}>
                                                            <CheckCircleOutlined />บันทึก
                                                        </Button>
                                                    </div>
                                                </>
                                            )

                                        }
                                        {
                                            !isEdit &&
                                            <div className="col-action">
                                                <Button style={{ color: "green" }} type="link" className="darkbtn" onClick={() => handleEditChange()}>
                                                    {pencil}แก้ไข
                                                </Button>
                                            </div>

                                        }
                                    </Card>
                                </Col>
                            }
                        </Row>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default ReferralUserByUserId;
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
    Input,
    Form,
    Space,
    Image,
    AutoComplete,
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

import { Link, useParams } from "react-router-dom";
import notificationWithIcon from "../../utils/notificationWithIcon";
import moment from 'moment';
import { deleteCampaignIdService, getCamapaignService } from "../../services/campaign.service";
import { getUserByUserId, getUserByUserIdService, getUserByUserMaxcardIdService, getUserByUserTelService, getUserByUserUsernameService } from "../../services/user.service";

const { Search } = Input;

function InquiryUser() {
    const [searchForm] = Form.useForm();

    const onSearch = (key, value) => {
        // console.log(key, value);
        getUser(key, value)
    }

    const [userData, setUserData] = useState([]);

    const columns = [
        {
            title: "User ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },

        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Mobile No.",
            dataIndex: "tel",
            key: "tel",
        },
        {
            title: "Maxcard No",
            dataIndex: "patois_maxcard_no",
            key: "patois_maxcard_no",
        },
        {
            title: "Status",
            dataIndex: "active",
            key: "active",
        },
        {
            title: "created Date",
            dataIndex: "createdAt",
            key: "createdAt",
        },
        {
            title: "created Date",
            dataIndex: "createdAt",
            key: "createdAt",
        },
        {
            title: "Notification",
            dataIndex: "notification",
            key: "notification",
            render: (__, record) => {
                return (
                    <>
                        <Button type="link"
                            onClick={() => {
                                window.open(
                                    "/notification?id=" + record.id,
                                    '_blank'
                                );
                            }}
                        >Detail
                        </Button>
                    </>
                )
            },
        },
        {
            title: "Maxpoint",
            dataIndex: "maxpoint",
            key: "maxpoint",
            render: (__, record) => {
                return (
                    <>
                        {
                            record.patois_maxcard_no &&
                            <Button
                                type="link"
                                onClick={() => {
                                    window.open(
                                        "/maxpoint?id=" + record.id,
                                        '_blank'
                                    );
                                }}
                            >Detail
                            </Button>
                        }
                    </>
                )
            },
        },


    ];


    const getUser = async (key, value) => {
        let data = [];
        if (key == 'tel') {
            data = await getUserByUserTelService(value);

        } else if (key == 'userId') {
            data = await getUserByUserIdService(value);

        } else if (key == 'username') {
            data = await getUserByUserUsernameService(value);

        } else if (key == 'maxcard_id') {
            data = await getUserByUserMaxcardIdService(value);

        }
        const userArray = [];
        if (data) {
            const users = data;
            for (const userObj of users) {
                const userObject = await setUserOjectData(userObj);
                userArray.push(userObject);
            }
        }
        setUserData(userArray);
    }

    const setUserOjectData = async (user) => {
        return {
            key: user.id,
            id: user.id,
            name: user.name,
            email: user.email,
            tel: user.tel,
            patois_maxcard_no: user.patois_maxcard_no,
            active: user.active == 1 ? "Active" : "Inactive",
            createdAt: moment(user.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            updatedAt: moment(user.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
        }
    }

    useEffect(() => {

    }, []);

    return (
        <>
            <Row
                gutter={[24, 0]}
                style={{ marginBottom: "15px" }}>
                <Col xs="24" xl={24}>
                    <Card
                        bordered={false}
                        className="header-solid h-full"
                        title="Inquiry User"
                    >
                        <Row gutter={[24, 0]}>
                            <Col span={24} md={24} className="mb-24">

                                <Form
                                    name="basic"
                                    initialValues={{
                                        remember: true,
                                    }}
                                    autoComplete="off"
                                    form={searchForm}
                                    scrollToFirstError={true}
                                    layout="vertical"
                                >
                                    <Row gutter={[24, 0]}>
                                        <Col span={24} md={12}>
                                            <Form.Item
                                                label="Mobile No."
                                                name="tel"
                                                style={{ marginBottom: "10px" }}
                                            >
                                                <Search
                                                    placeholder="input search text"
                                                    enterButton="Search"
                                                    onSearch={(event) => {
                                                        onSearch("tel", event)
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                />

                                            </Form.Item>
                                            <Form.Item
                                                label="User ID"
                                                name="userId"
                                                style={{ marginBottom: "10px" }}
                                            >
                                                <Search
                                                    placeholder="input search text"
                                                    enterButton="Search"
                                                    onSearch={(event) => {
                                                        onSearch("userId", event)
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                />

                                            </Form.Item>

                                        </Col>
                                        <Col span={24} md={12}>

                                            <Form.Item
                                                label="Username"
                                                name="username"
                                                style={{ marginBottom: "10px" }}
                                            >
                                                <Search
                                                    placeholder="input search text"
                                                    enterButton="Search"
                                                    onSearch={(event) => {
                                                        onSearch("username", event)
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                />

                                            </Form.Item>
                                            <Form.Item
                                                label="Maxcard ID"
                                                name="maxcard_id"
                                                style={{ marginBottom: "10px" }}
                                            >
                                                <Search
                                                    placeholder="input search text"
                                                    enterButton="Search"
                                                    onSearch={(event) => {
                                                        onSearch("maxcard_id", event)
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                />

                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[24, 0]}>
                <Col xs="24" xl={24}>
                    <Card
                        bordered={false}
                        className="header-solid h-full"
                    >
                        <div className="table-responsive">
                            <Table
                                columns={columns}
                                dataSource={userData}
                                pagination={{
                                    position: ['topRight', 'bottomRight'],
                                }}
                                className="ant-border-space"
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default InquiryUser;
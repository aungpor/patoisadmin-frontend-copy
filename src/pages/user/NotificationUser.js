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
import { useHistory } from "react-router-dom";

import notificationWithIcon from "../../utils/notificationWithIcon";
import moment from 'moment';
import { deleteNotificationByNotificationIdService, getNotificationByMaxcardIdService, getNotificationByUserIdService, getNotificationByUserTelService, sendNotificationService } from "../../services/notification.service";
import { getUserByUserIdService, getUserByUserMaxcardIdService, getUserByUserTelService } from "../../services/user.service";

const { Search } = Input;

function NoticationUser(props) {
    let history = useHistory();
    const idParam = new URLSearchParams(props.location.search).get("id")
    const [searchForm] = Form.useForm();
    const [addNotificationForm] = Form.useForm();

    const [userNotificationData, setUserNotificationData] = useState([]);;
    const [showCreatNotification, setShowCreatNotification] = useState(false);
    const [userData, setUserData] = useState([]);


    const userNotificationColumns = [
        {
            title: "ID",
            key: "notifications_id",
            dataIndex: "notifications_id",
        },
        {
            title: "User Id",
            key: "withs",
            dataIndex: "withs",
        },
        {
            title: "Title",
            key: "title",
            dataIndex: "title",
        },
        {
            title: "Description",
            key: "description",
            dataIndex: "description",
        },
        {
            title: "Type",
            key: "types",
            dataIndex: "types",
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
        },
        {
            title: "Created Date",
            key: "createdAt",
            dataIndex: "createdAt",
        },
        {
            key: "action",
            title: "Action",
            dataIndex: "action",
            render: (__, record) => {
                return (
                    <>
                        {
                            record.types === 'report_admin_manual' &&
                            <DeleteOutlined onClick={() => deleteConfirm(record)} />
                        }
                    </>
                )
            },
        },

    ];


    const getNotification = async (key, value) => {
        let data = [];
        if (key == 'tel') {
            data = await getNotificationByUserTelService(value);

        } else if (key == 'userId') {
            data = await getNotificationByUserIdService(value);

        } else if (key == 'maxcard_id') {
            data = await getNotificationByMaxcardIdService(value);

        }
        const notificationArray = [];
        if (data) {
            const notifications = data;
            for (const userObj of notifications) {
                const notificationObject = await setNotificationOjectData(userObj);
                notificationArray.push(notificationObject);
            }
        }
        // if (data.length != 0) {
        //     history.push("/notification?id=" + data[0].withs);
        //     addNotificationForm.setFieldsValue({
        //         "title": "แจ้งเตือนจากผู้ดูแลระบบ",
        //         "withs": data[0].withs
        //     });
        // }
        setUserNotificationData(notificationArray);
        getUser(key, value);
    }

    const setNotificationOjectData = async (notification) => {
        return {
            key: notification.notifications_id,
            notifications_id: notification.notifications_id,
            withs: notification.withs,
            title: notification.title,
            description: notification.description,
            types: notification.types,
            status: notification.status == 1 ? "Unread" : "Read",
            createdAt: moment(notification.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            updatedAt: moment(notification.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
        }
    }

    const getUser = async (key, value) => {
        let data = [];
        if (key == 'tel') {
            data = await getUserByUserTelService(value);

        } else if (key == 'userId') {
            data = await getUserByUserIdService(value);

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
        if (data.length != 0) {
            history.push("/notification?id=" + data[0].id);
            addNotificationForm.setFieldsValue({
                "title": "แจ้งเตือนจากผู้ดูแลระบบ",
                "withs": data[0].id,
                "name": data[0].name,

            });
        }
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

    const addNotification = async (title, description, withs, notificationType) => {
        const notification = await sendNotificationService(title, description, withs, notificationType);
        // console.log("notification: ", notification);
        if (notification?.data?.ResponseCode == 200) {
            addNotificationForm.resetFields();
            addNotificationForm.setFieldsValue({
                "title": "แจ้งเตือนจากผู้ดูแลระบบ"
            });


            notificationWithIcon("success", "Added Notification Success!",);
            window.location.reload();
        }
        else {
            notificationWithIcon("error", "Cannot Added Notification", notification?.ResponseMsg);
        }
    }

    const addNotificationConfirm = (title, description, withs, notificationType, name) => {
        Modal.confirm({
            title: 'Confirm to Add notification?',
            icon: <ExclamationCircleOutlined />,
            content: (
                <>
                    <p>Title: {title}</p>
                    <p>Description: {description}</p>
                    <p>User: ({withs}) {name} </p>
                </>
            ),

            okText: 'Yes',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                addNotification(title, description, withs, notificationType);
            },
        });
    }

    const deleteConfirm = (record) => {
        Modal.confirm({
            title: 'Confirm to delete?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                deleteNotification(record)
            },
        });
    };

    const deleteNotification = async (notification) => {
        let deletedNotification = await deleteNotificationByNotificationIdService(notification.notifications_id);
        // console.log("deletedNotification: ", deletedNotification);
        if (deletedNotification?.ResponseCode == 200) {
            notificationWithIcon("success", "Deleted notification Success!",);
            window.location.reload();
        }
        else {
            notificationWithIcon("error", "Cannot deleted notification", deletedNotification?.ResponseMsg);
        }
    }

    const onFinishNotification = (values) => {
        console.log("values: ", values);
        addNotificationConfirm(values.title, values.description, values.withs, "report_admin_manual", values.name);

    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    const onSearch = (key, value) => {
        // console.log(key, value);
        getNotification(key, value)
    }

    useEffect(() => {
        // console.log("idParam: ", idParam);
        searchForm.setFieldsValue({
            "userId": idParam
        });
        addNotificationForm.setFieldsValue({
            "title": "แจ้งเตือนจากผู้ดูแลระบบ",
            "withs": idParam,

        })
        getNotification("userId", idParam);
    }, [])

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
            {
                idParam &&
                <Row gutter={[24, 0]}>
                    <Col span={24} md={24} className="mb-24">
                        <Card
                            bordered={false}
                            className="header-solid h-full"
                            title="Add Notification"
                        >
                            <Form
                                name="basic"
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onFinishNotification}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                                form={addNotificationForm}
                                scrollToFirstError={true}
                                layout="vertical"
                            >
                                <Form.Item
                                    style={{ marginBottom: "5px" }}
                                    name="title"
                                    label='Title'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required',
                                        },
                                    ]}>
                                    <Input
                                        style={{ width: "100%" }} />
                                </Form.Item>
                                <Form.Item style={{ marginBottom: "5px" }}
                                    name="description"
                                    label='Description'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required',
                                        },
                                    ]}>
                                    <Input
                                        style={{ width: "100%" }} />
                                </Form.Item>

                                <Form.Item style={{ marginBottom: "5px" }}
                                    name="withs"
                                    label='User ID'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required',
                                        },
                                    ]}>
                                    <Input
                                        style={{ width: "100%" }}
                                        readOnly={true}
                                    />
                                </Form.Item>
                                <Form.Item style={{ marginBottom: "5px" }}
                                    name="name"
                                    label='Name'>
                                    <Input
                                        style={{ width: "100%" }}
                                        readOnly={true}
                                    />
                                </Form.Item>
                            </Form>
                            <Space direction="horizontal" style={{ marginTop: "10px", width: '100%', justifyContent: 'center' }}>
                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Button type="primary" style={{ background: "rgb(96, 184, 88)", borderRadius: "10px" }} htmlType="submit" onClick={() => addNotificationForm.submit()}>Submit</Button>
                                </Form.Item>
                            </Space>
                        </Card>

                    </Col>
                </Row>
            }

            <Row gutter={[24, 0]}>
                <Col xs="24" xl={24}>
                    <Card
                        bordered={false}
                        title="Notification"
                    >
                        <div className="table-responsive">
                            <Table
                                columns={userNotificationColumns}
                                dataSource={userNotificationData}
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

export default NoticationUser;
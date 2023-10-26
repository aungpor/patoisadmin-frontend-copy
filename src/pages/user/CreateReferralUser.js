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
    Form,
    Input,
    Space
} from "antd";
import { useEffect, useState } from "react";
import { creatUserService, getUserByUserIdService, updateUserService } from "../../services/user.service";
import { useParams } from "react-router-dom";
import notificationWithIcon from '../../utils/notificationWithIcon'

const { Option } = Select;



function CreateReferralUser() {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        console.log('onFinish:', values);
        createUser(values);

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const createUser = async (data) => {
        const user = await creatUserService(data);
        console.log("user: ", user);
        if (user.ResponseCode == 200) {
            form.resetFields();
            notificationWithIcon("success", "เพิ่มข้อมูลผู้ใช้งานสำเร็จ!",);
        }
        else {
            notificationWithIcon("error", "เพิ่มข้อมูลผู้ใช้งานไม่สำเร็จ", user.ResponseMsg);
        }
    }
    useEffect(() => {

    }, [])

    return (
        <>
            <Row gutter={[24, 0]}>
                <Col span={24} md={24} className="mb-24">
                    <Card
                        className="header-solid h-full "
                        bordered={false}
                        title={[<h6 className="font-semibold m-0">Create Referral User</h6>]}
                        bodyStyle={{ paddingTop: "0" }}
                    >
                        <Row gutter={[24, 24]}>
                            <Col span={24}>
                                <Card className="card-billing-info" bordered="false">
                                    <div className="col-info">

                                        <Form
                                            name="basic"
                                            labelCol={{
                                                span: 8,
                                            }}
                                            // wrapperCol={{
                                            //     span: 100,
                                            // }}
                                            initialValues={{
                                                remember: true,
                                            }}
                                            onFinish={onFinish}
                                            onFinishFailed={onFinishFailed}
                                            autoComplete="off"
                                            form={form}
                                            scrollToFirstError={true}
                                            style={{
                                                padding: "20px"
                                            }}
                                        >
                                            <Form.Item
                                                label="Name"
                                                name="name"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Name is required',
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>

                                            {/* <Form.Item
                                                label="Email"
                                                name="email"
                                            >
                                                <Input />
                                            </Form.Item> */}
                                            {/* <Form.Item
                                                label="Tel"
                                                name="tel"
                                            >
                                                <Input />
                                            </Form.Item> */}
                                            <Form.Item
                                                label="Ref Code"
                                                name="user_code"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Ref Code is required',
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Form>
                                        <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
                                            <Form.Item
                                                wrapperCol={{
                                                    offset: 8,
                                                    span: 16,
                                                }}
                                            >
                                                <Button type="primary" style={{ background: "rgb(96, 184, 88)", borderRadius: "10px" }} htmlType="submit" onClick={() => form.submit()}>Submit</Button>
                                            </Form.Item>
                                        </Space>
                                    </div>
                                </Card>
                            </Col>
                        </Row>




                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default CreateReferralUser;
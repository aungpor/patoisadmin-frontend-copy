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
    Space,
    DatePicker
} from "antd";
import moment from 'moment';
import { ExclamationCircleOutlined, CloseOutlined, CloseCircleOutlined, CheckCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import { creatUserService, getUserByUserIdService, updateUserService } from "../../services/user.service";
import { useParams } from "react-router-dom";
import notificationWithIcon from '../../utils/notificationWithIcon'
import { getPromotionTypesService } from "../..//services/promotion.service";
import { createCampaignService, editCampaignService, getCampaignByCampaignIdService } from "../../services/campaign.service";


const { RangePicker } = DatePicker;
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


function CampaignForm(props) {
    const [campaignId, setCamapaignId] = useState(props.campaignId);
    const [campaignName, setCamapaignName] = useState(props.campaignName);
    const [formType, setFormType] = useState(props.type);

    const [promotionTypedata, setPromotionTpyeData] = useState([]);
    const [form] = Form.useForm();

    const getPromotionTypes = async () => {
        const data = await getPromotionTypesService();
        if (data) {
            const newData = data.map(item => {
                return {
                    label: item.promo_type,
                    value: item.promo_type
                }
            });
            setPromotionTpyeData(newData);
        }
    }

    const getCampaignByCamapaignId = async (campaignId) => {
        const campaignData = await getCampaignByCampaignIdService(campaignId);
        if (campaignData.length) {
            campaignData[0].campaign_date = [moment(campaignData[0]?.campaign_start_date, 'YYYY/MM/DD'), moment(campaignData[0]?.campaign_end_date, 'YYYY/MM/DD')];
            // console.log("campaignData[0]: ", campaignData[0]);
            form.setFieldsValue(campaignData[0]);
        }
    }

    const onFinish = async (values) => {

        values.campaign_start_date = moment(values.campaign_date[0]).format("YYYY-MM-DD");
        values.campaign_end_date = moment(values.campaign_date[1]).format("YYYY-MM-DD");
        values.campaign_date = undefined;
        if (formType === 'create') {
            // console.log('create onFinish:', values);
            creatCampaign(values);
        } else if (formType === 'edit') {
            values.campaign_id = campaignId;
            editCamapaign(values);

        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const creatCampaign = async (data) => {
        const campaign = await createCampaignService(data);
        // console.log("campaign: ", campaign);
        if (campaign?.ResponseCode == 200) {
            form.resetFields();
            form.setFieldsValue({
                active: true,
                for_new_user_only: "Y",
                limit_promo_per_giver: 1000000,
                limit_promo_per_campaign: 1000000,
                limit_promo_per_receiver: 1,
                campaign_noti_title: "ยินดีต้อนรับสมาชิกใหม่พาทัวร์"
            });
            notificationWithIcon("success", "Created campaign Success!",);

        }
        else {
            notificationWithIcon("error", "Cannot created campaign", campaign?.ResponseMsg);
        }
    }

    const editCamapaign = async (data) => {
        const campaign = await editCampaignService(data);
        // console.log("campaign: ", campaign);
        if (campaign?.ResponseCode == 200) {
            setFormType("view");
            notificationWithIcon("success", "Created campaign Success!",);
        }
        else {
            notificationWithIcon("error", "Cannot created campaign", campaign?.ResponseMsg);
        }
    }



    useEffect(() => {

        getPromotionTypes();
        if (formType == "view") {
            getCampaignByCamapaignId(campaignId)
        } else {
            form.setFieldsValue({
                active: true,
                for_new_user_only: "Y",
                limit_promo_per_giver: 1000000,
                limit_promo_per_campaign: 1000000,
                limit_promo_per_receiver: 1,
                campaign_noti_title: "ยินดีต้อนรับสมาชิกใหม่พาทัวร์"
            });
        }
    }, [])

    return (
        <>
            <Row gutter={[24, 0]}>
                <Col xs={24} className="mb-24">
                    <Card
                        className="header-solid h-full ant-card-p-0"
                        title={
                            <>
                                <Row
                                    gutter={[24, 0]}
                                    className="ant-row-flex ant-row-flex-middle"
                                >
                                    <Col xs={24} md={12}>
                                        <h6 className="font-semibold m-0">{campaignName}</h6>
                                    </Col>

                                </Row>
                            </>

                        }
                        extra={
                            <>
                                {
                                    formType === "view" &&
                                    <Button
                                        type="link"
                                        style={{ color: "green" }}
                                        onClick={() => {
                                            setFormType("edit")
                                        }}>
                                        {pencil}Edit Promotion
                                    </Button>
                                }
                                {
                                    formType === "edit" &&
                                    <Button
                                        type="link"
                                        style={{ color: "red" }}
                                        onClick={() => {
                                            setFormType("view")
                                        }}>
                                        <CloseCircleOutlined />Cancel
                                    </Button>
                                }
                            </>
                        }
                    >
                        <Form
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            form={form}
                            scrollToFirstError={true}
                            layout="vertical"
                        >
                            <Row gutter={[24, 0]}>
                                <Col span={24} md={12}>
                                    <Form.Item style={{ marginBottom: "5px" }}
                                        name="campaign_name"
                                        label='Campaign Name'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'This field is required',
                                            },
                                        ]}>
                                        <Input
                                            style={{ width: "100%" }}
                                            readOnly={formType == 'view' ? true : false}
                                        />
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: "5px" }}
                                        name="campaign_date"
                                        label='Campaign Date'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'This field is required',
                                            },
                                        ]}>
                                        < RangePicker
                                            disabled={formType == 'view' ? [true, true] : [false, false]}
                                            // defaultValue={[moment('2015/01/01', 'YYYY/MM/DD'), moment('2015/01/01', 'YYYY/MM/DD')]}
                                            size={"large"}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>

                                    <Form.Item style={{ marginBottom: "5px" }}
                                        name="campaign_desc"
                                        label='Campaign Desc'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'This field is required',
                                            },
                                        ]}>
                                        <Input
                                            style={{ width: "100%" }}
                                            readOnly={formType == 'view' ? true : false}
                                        />
                                    </Form.Item>

                                    <Form.Item style={{ marginBottom: "5px" }}
                                        name="for_new_user_only"
                                        label='For New User Only'>
                                        <Select
                                            size={"large"}
                                            style={{ width: "100%" }}
                                            disabled={formType == 'view' ? true : false}
                                            options={[
                                                {
                                                    value: 'Y',
                                                    label: 'Yes',
                                                },
                                                {
                                                    value: 'N',
                                                    label: 'No',
                                                },]}
                                        >
                                        </Select>
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: "5px" }}
                                        name="campaign_noti_title"
                                        label='Campaign Notification Title'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'This field is required',
                                            },
                                        ]}>
                                        <Input
                                            style={{ width: "100%" }}
                                            readOnly={formType == 'view' ? true : false} />
                                    </Form.Item>

                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item style={{ marginBottom: "5px" }}
                                        name="promo_coupon_type"
                                        label='Promo Coupon Type'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'This field is required',
                                            },
                                        ]}>
                                        <Select
                                            size={"large"}
                                            style={{ width: "100%" }}
                                            allowClear
                                            options={promotionTypedata}
                                            disabled={formType == 'view' ? true : false}
                                        >
                                        </Select>
                                    </Form.Item>

                                    <Form.Item style={{ marginBottom: "5px" }}
                                        name="limit_promo_per_giver"
                                        label='Limit Promo Per Giver'>
                                        <Input
                                            style={{ width: "100%" }}
                                            readOnly={formType == 'view' ? true : false}
                                        />
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: "5px" }}
                                        name="limit_promo_per_receiver"
                                        label='Limit Promo Per Receiver'>
                                        <Input
                                            style={{ width: "100%" }}
                                            readOnly={formType == 'view' ? true : false}
                                        />
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: "5px" }}
                                        name="limit_promo_per_campaign"
                                        label='Limit Promo Per Campaign'>
                                        <Input
                                            style={{ width: "100%" }}
                                            readOnly={formType == 'view' ? true : false}
                                        />
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: "5px" }}
                                        name="active"
                                        label='Status'>
                                        <Select
                                            size={"large"}
                                            defaultValue={true}
                                            style={{ width: "100%" }}
                                            disabled={formType == 'view' ? true : false}
                                        // onChange={handleChange}
                                        >
                                            <Option value={true}>Active</Option>
                                            <Option value={false}>Inactive</Option>
                                        </Select>
                                    </Form.Item>
                                    {/* </Form> */}
                                </Col>
                            </Row>
                        </Form>

                        {
                            (formType == "create" || formType == "edit") &&
                            <Space direction="horizontal" style={{ marginTop: "10px", width: '100%', justifyContent: 'center' }}>
                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Button type="primary" style={{ background: "rgb(96, 184, 88)", borderRadius: "10px" }} htmlType="submit" onClick={() => form.submit()}>Submit</Button>
                                </Form.Item>
                            </Space>
                        }
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default CampaignForm;
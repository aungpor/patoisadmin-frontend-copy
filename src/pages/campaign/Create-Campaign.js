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

import { useEffect, useState } from "react";
import { creatUserService, getUserByUserIdService, updateUserService } from "../../services/user.service";
import { useParams } from "react-router-dom";
// import notificationWithIcon from '../utils/notificationWithIcon'
// import { getPromotionTypesService } from "../services/promotion.service";
// import { createCampaignService } from "../services/campaign.service";
import CampaignForm from "../../components/form/CampaignForm";


const { RangePicker } = DatePicker;
const { Option } = Select;

function CreateCampagin() {
    // const [promotionTypedata, setPromotionTpyeData] = useState([]);
    // const [form] = Form.useForm();

    // const getPromotionTypes = async () => {
    //     const data = await getPromotionTypesService();
    //     if (data) {
    //         const newData = data.map(item => {
    //             return {
    //                 label: item.promo_type,
    //                 value: item.promo_type
    //             }
    //         });
    //         setPromotionTpyeData(newData);
    //     }
    // }

    // const onFinish = async (values) => {
    //     console.log('onFinish:', values);
    //     // console.log("moment: ", moment(values.campaign_date[0]).format("YYYY-MM-DD"));
    //     // console.log("moment: ", moment(values.campaign_date[1]).format("YYYY-MM-DD"));
    //     values.campaign_start_date = moment(values.campaign_date[0]).format("YYYY-MM-DD");
    //     values.campaign_end_date = moment(values.campaign_date[1]).format("YYYY-MM-DD");
    //     values.campaign_date = undefined;
    //     creatCampaign(values);
    // };

    // const onFinishFailed = (errorInfo) => {
    //     console.log('Failed:', errorInfo);
    // };

    // const creatCampaign = async (data) => {
    //     const campaign = await createCampaignService(data);
    //     console.log("campaign: ", campaign);
    //     if (campaign?.ResponseCode == 200) {
    //         form.resetFields();
    //         notificationWithIcon("success", "Created campaign Success!",);
    //     }
    //     else {
    //         notificationWithIcon("error", "Cannot created campaign", campaign?.ResponseMsg);
    //     }
    // }

    // useEffect(() => {

    //     getPromotionTypes();

    //     form.setFieldsValue({
    //         active: '1',
    //         for_new_user_only: "Y",
    //         limit_promo_per_giver: 1000000,
    //         limit_promo_per_campaign: 1000000,
    //         limit_promo_per_receiver: 1,
    //         campaign_noti_title: "ยินดีต้อนรับสมาชิกใหม่พาทัวร์"

    //     });
    // }, [])

    return (
        <>
            <Row gutter={[24, 0]}>
                <Col xs={24} md={24}>
                    <CampaignForm
                        campaignName={"Create Campaign"}
                        campaignId={""}
                        type={"create"}
                    />
                </Col>
            </Row>
        </>
    )
}

export default CreateCampagin;
import {
    Row,
    Col,
    Card,
    Table,
    Modal,
    Button
} from "antd";

import {
    PlusOutlined,
    ExclamationOutlined,
    ExclamationCircleOutlined,
    PlusCircleOutlined,
    CloudDownloadOutlined,
    DeleteOutlined,
    QrcodeOutlined
} from "@ant-design/icons";

import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteCampaignIdService, getCamapaignService } from "../../services/campaign.service";
import notificationWithIcon from "../../utils/notificationWithIcon";




function Campaign() {
    const [campaignData, setCampaignData] = useState([]);

    const columns = [
        {
            title: "Campaign ID",
            dataIndex: "campaign_id",
            key: "campaign_id",
        },
        {
            title: "Campaign Name",
            dataIndex: "campaign_name",
            key: "campaign_name",
        },

        {
            title: "Campaign Code",
            dataIndex: "campaign_code",
            key: "campaign_code",
        },
        {
            title: "Promotion",
            dataIndex: "promo_coupon_type",
            key: "promo_coupon_type",
        },
        // {
        //     title: "Status",
        //     dataIndex: "active",
        //     key: "active",
        // },
        {
            title: "Detail",
            dataIndex: "detail",
            key: "detail",
            render: (__, record) => {
                return (
                    <>
                        <div className="ant-employed">
                            <Link to={`campaign/${record.campaign_id}`}>
                                View
                            </Link>
                        </div>
                    </>
                )
            },
        },
        {
            key: "action",
            title: "Action",
            dataIndex: "action",
            render: (__, record) => {
                return (
                    <>
                        <div className="ant-employed">
                            <DeleteOutlined onClick={() => confirm(record)} />
                        </div>
                    </>
                )
            },
        },

    ];


    const confirm = (record) => {
        Modal.confirm({
            title: 'Confirm to delete?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                deleteCampaignByCampaignId(record);
            },
        });
    };

    const deleteCampaignByCampaignId = async (campaign) => {
        // console.log("campaign: ", campaign.campaign_user_id);
        let deletedCampaign = await deleteCampaignIdService(campaign.campaign_id);
        if (deletedCampaign?.ResponseCode == 200) {
            notificationWithIcon("success", "Deleted campaign Success!",);
            window.location.reload();
        }
        else {
            notificationWithIcon("error", "Cannot deleted campaign", deletedCampaign?.ResponseMsg);
        }
    }

    const getCampaign = async () => {
        const CampaignArray = [];
        const data = await getCamapaignService();
        if (data) {
            const campaigns = data;
            for (const canpaignObj of campaigns) {
                const campaignObject = await setCamapaignObjectData(canpaignObj);
                CampaignArray.push(campaignObject);
            }
        }
        setCampaignData(CampaignArray);
    }

    const setCamapaignObjectData = async (camapaign) => {
        return {
            key: camapaign.campaign_id,
            campaign_id: camapaign.campaign_id,
            campaign_name: camapaign.campaign_name,
            campaign_code: camapaign.campaign_code,
            promo_coupon_type: camapaign.promo_coupon_type,
            // active: camapaign.active == 1 ? "Active" : "Inactive",
            detail: (
                <>
                    <div className="ant-employed">
                        <Link to={`campaign/${camapaign.campaign_id}`}>
                            View
                        </Link>
                    </div>
                </>
            )
        }
    }

    useEffect(() => {
        getCampaign();
    }, []);
    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Campaign"
                        >
                            <Col span={12} offset={21}>
                                <a href="/create-campaign"><Button className="ant-btn ant-btn-primary">Create Campaign</Button></a>
                            </Col>
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={campaignData}
                                    pagination={false}
                                    className="ant-border-space"
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Campaign;
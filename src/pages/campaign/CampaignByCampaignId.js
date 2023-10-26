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
    AutoComplete
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
import { getNearbyShopSerivce, getShopByShopIdService, mergeShopService, updateStatusCodeShop } from "../../services/shop.service";

import { Link, useParams } from "react-router-dom";
import { createCampaignUserService, deleteCampaignUserIdService, getCamapaignReferralByPage } from "../../services/campaign.service";
import CampaignForm from "../../components/form/CampaignForm";
import { getManualUserProviderService } from "../../services/user.service";
import notificationWithIcon from "../../utils/notificationWithIcon";
import { generateZip } from "../../utils/jszip";
import moment from 'moment';
import useClipboard from "react-use-clipboard";


function CampaignByCamapaignId() {
    const [promotionReferralForm] = Form.useForm();
    let params = useParams();
    const [campaignReferralData, setCampaignReferralData] = useState([]);;
    const [userManualProviderData, setUserManualProviderData] = useState([]);
    const [showCreateNewPromotionReferral, setShowCreateNewPromotionReferral] = useState(false);
    const [showQrCodeImage, setShowQrcodeImage] = useState(false);
    const [qrCodeImage, setQrCodeImage] = useState("");
    const [textClipbroad, setTextClipbroad] = useState("");
    const [isCopied, setCopied] = useClipboard(textClipbroad, {
        successDuration: 1000,
    });
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5
        },
    })


    const campaignReferralColumns = [
        {
            key: "campaign_user_id",
            dataIndex: "campaign_user_id",
            title: "ID",
        },
        {
            key: "ref_code",
            dataIndex: "ref_code",
            title: "Referral Code",
        },
        {
            key: "createdAt",
            dataIndex: "createdAt",
            title: "Created Date",
        },
        {
            key: "action",
            title: "Link",
            dataIndex: "Link",
            render: (__, record) => {
                return (
                    <>
                        <div className="ant-employed">
                            <Button
                                // type="link"
                                onClick={() => {
                                    window.open(
                                        record.campaign_url,
                                        '_blank'
                                    );
                                }}
                            >
                                Go to
                            </Button>
                        </div>
                    </>
                )
            },
        },
        {
            key: "clipbroad",
            dataIndex: "clipbroad",
            title: "Clipbroad",
            render: (__, record) => {
                return (
                    <>
                        <div className="ant-employed">
                            <CopyOutlined onClick={() => {
                                setTextClipbroad(record.campaign_url);
                            }} />
                        </div>
                    </>
                )
            },
        },
        {
            key: "action",
            title: "Qr Code",
            dataIndex: "Qr Code",
            render: (__, record) => {
                return (
                    <>
                        <div className="ant-employed">
                            <QrcodeOutlined onClick={() => {
                                setShowQrcodeImage(true)
                                setQrCodeImage(record.qrcode)
                            }}
                            />

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

    const getCampaignReferral = async (campaignId) => {
        const campaignReferralsData = await getCamapaignReferralByPage(tableParams, campaignId);
        const campaignReferrals = campaignReferralsData.data
        let campaignReferralArray = [];
        if (campaignReferrals) {
            for (const campaignReferral of campaignReferrals) {
                const referralObject = await setPCampaignReferralObjectData(campaignReferral);
                campaignReferralArray.push(referralObject);
            }
        }
        setCampaignReferralData(campaignReferralArray);
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                total: campaignReferralsData?.total,
            },
        });
    }

    const getUserManual = async () => {
        const data = await getManualUserProviderService();
        if (data) {
            const newData = data.map(item => {
                return {
                    label: item.name + " : " + item.user_code,
                    value: JSON.stringify(item)
                    // value: item.name
                }
            });
            setUserManualProviderData(newData);
        }
    }

    const onFinishPromotionReferral = async (values) => {
        // console.log('onFinish:', JSON.parse(values.user_provider_manaul));
        // console.log('onFinish:', params.id);
        // console.log('onFinish:', campaignReferralColumns);

        creatCampaignReferral(JSON.parse(values.user_provider_manaul), params.id);

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const creatCampaignReferral = async (data, campaignId) => {
        const campaignUser = await createCampaignUserService(data, campaignId);
        console.log("campaignUser: ", campaignUser);
        if (campaignUser?.ResponseCode == 200) {
            promotionReferralForm.resetFields();
            notificationWithIcon("success", "Created campaign Success!",);
            window.location.reload();
        }
        else {
            notificationWithIcon("error", "Cannot created campaign", campaignUser?.ResponseMsg);
        }
    }

    const confirm = (record) => {
        Modal.confirm({
            title: 'Confirm to delete?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                deleteCampaignReferral(record)
            },
        });
    };

    const deleteCampaignReferral = async (campaignReferral) => {
        // console.log("campaignReferral: ", campaignReferral.campaign_user_id);
        let deletedCampaignUser = await deleteCampaignUserIdService(campaignReferral.campaign_user_id);
        console.log("deletedCampaignUser: ", deletedCampaignUser);
        if (deletedCampaignUser?.ResponseCode == 200) {
            notificationWithIcon("success", "Deleted campaign Success!",);
            window.location.reload();
        }
        else {
            notificationWithIcon("error", "Cannot deleted campaign", deletedCampaignUser?.ResponseMsg);
        }
    }

    const setPCampaignReferralObjectData = async (campaignReferral) => {
        // console.log("shopdata", shopData);
        return {
            key: campaignReferral.campaign_user_id,
            campaign_user_id: campaignReferral.campaign_user_id,
            campaign_url: campaignReferral.campaign_url,
            qrcode: campaignReferral.qrcode,
            ref_code: campaignReferral.ref_code,
            createdAt: moment(campaignReferral.createdAt).format("YYYY-MM-DD hh:mm:ss a")
            // createdAt: campaignReferral.createdAt
        }
    }
    
    const onChange = (pagination) => {
        setTableParams({ pagination})
    };

    useEffect(() => {
        getCampaignReferral(params.id);
    }, [JSON.stringify(tableParams)]);

    useEffect(() => {
        if (textClipbroad !== "") {
            setCopied(textClipbroad);
            notificationWithIcon("success", "Copy clipbroad success",);
        }
    }, [textClipbroad]);

    return (
        <>
            <Row gutter={[24, 0]}>
                <Col span={24} md={24} className="mb-24">
                    <Row gutter={[24, 24]} >
                        <Col span={24} key={0}>
                            <CampaignForm
                                campaignName={"Campaign Detail"}
                                campaignId={params.id}
                                type={"view"}
                            />
                        </Col>
                    </Row>


                </Col>
            </Row>

            <Row gutter={[24, 0]}>
                <Col span={24} md={24} className="mb-24">
                    <Card
                        className="header-solid h-full"
                        bordered={false}
                        title={[<h6 className="font-semibold m-0">Camapaign Referral</h6>]}
                        bodyStyle={{ paddingTop: "0" }}
                        extra={
                            <>
                                <Button
                                    style={{ color: "green" }}
                                    type="link"
                                    onClick={() => {
                                        setShowCreateNewPromotionReferral(true);
                                        getUserManual();
                                    }}
                                >
                                    <PlusCircleOutlined />New Promotion Referral
                                </Button>
                                <Button
                                    onClick={() => {
                                        // console.log("campaignReferralData: ", campaignReferralData);
                                        generateZip(campaignReferralData)
                                    }}
                                ><CloudDownloadOutlined /> Download</Button>
                            </>
                        }
                    >
                        {
                            showCreateNewPromotionReferral &&
                            <Row gutter={[24, 0]}>
                                <Col span={24} md={24} className="mb-24">
                                    <Card
                                        className="header-solid h-full "
                                        bordered={false}
                                    >
                                        <Form
                                            name="basic"
                                            initialValues={{
                                                remember: true,
                                            }}
                                            onFinish={onFinishPromotionReferral}
                                            onFinishFailed={onFinishFailed}
                                            autoComplete="off"
                                            form={promotionReferralForm}
                                            scrollToFirstError={true}
                                            layout="inline"
                                        >
                                            <Form.Item
                                                style={{ marginBottom: "5px" }}
                                                label="Referral Code"
                                                name="user_provider_manaul"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Ref Code is required',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    size={"large"}
                                                    style={{ width: "400px" }}
                                                    allowClear
                                                    options={userManualProviderData}
                                                    showSearch={true}
                                                >
                                                </Select>

                                            </Form.Item>
                                            <Button type="primary" style={{ background: "rgb(96, 184, 88)", }} htmlType="submit">Submit</Button>
                                        </Form>

                                    </Card>
                                </Col>
                            </Row>
                        }

                        <Row gutter={[24, 24]} >
                            <Col span={24} key={0}>
                                <div className="table-responsive">
                                    <Table
                                        columns={campaignReferralColumns}
                                        dataSource={campaignReferralData}
                                        pagination={tableParams.pagination}
                                    onChange={onChange}
                                        className="ant-border-space"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Card>

                </Col>
            </Row>

            {/* image qrcode */}
            <Image
                width={200}
                style={{
                    display: 'none',
                }}
                src={qrCodeImage}
              
                preview={{
                    visible: showQrCodeImage,
                    onVisibleChange: (visible, prevVisible) => setShowQrcodeImage(visible),
                }}
            />

        </>
    )
}


export default CampaignByCamapaignId;
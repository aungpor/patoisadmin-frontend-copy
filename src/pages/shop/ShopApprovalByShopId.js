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

import { PlusOutlined, ExclamationOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getNearbyShopSerivce, getShopByShopIdService, mergeShopService, updateStatusCodeShop } from "../../services/shop.service";
import { sendNotificationToFollowerService } from '../../services/notification.service'
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

const ShopApprovalBYShopId = (props) => {
    let params = useParams();
    const [shopData, setShopData] = useState({});
    const [shopStatusCodeData, setShopStatusCodeData] = useState();
    const [nearbyShopData, setNearbyShopData] = useState([]);
    const [shopStatusCode, setShopStastusCode] = useState("2");
    const [isStatusEdit, setIsStatusEdit] = useState(false);

    const getShop = async (shopId) => {
        const data = await getShopByShopIdService(shopId);
        if (data) {
            const shop = data
            setShopData(shop);
            setShopStatusCodeData(shop.shop_status_code)
            const nearbyShop = await getNearbyShopSerivce(shop.latitude, shop.longitude);
            let nearbyShopArray = [];
            if (nearbyShop) {
                for (const shop of nearbyShop) {
                    if (data.shop_id != shop.sid) {
                        const shopObject = await setNearbyShopObjectData(shop);
                        nearbyShopArray.push(shopObject);
                    }
                }
            }
            setNearbyShopData(nearbyShopArray);
        }
    }

    const handleChange = (value) => {
        console.log(`selected ${value}`);
        setIsStatusEdit(true);
        setShopStastusCode(value);
    };

    const handleSaveStatusShop = async () => {
        setIsStatusEdit(false)
        // เพิ่ม
        let response = await updateStatusCodeShop(shopData, shopStatusCode);
        await sendNotificationToFollowerService(shopData.user_id, shopData.shop_id)
        if (response?.data?.ResponseCode == 200) {
            setShopStatusCodeData(response?.data?.data?.shop_status_code)
        }
    }

    const handleMergeShop = async (from_shop, to_shop) => {
        let response = await mergeShopService(from_shop, to_shop)
        if (response?.data?.ResponseCode == 200) {
            setShopStatusCodeData("3")
        }
    }

    //modal
    const confirm = () => {
        Modal.confirm({
            title: 'ยืนยันการแก้ไขข้อมูลร้าน',
            icon: <ExclamationCircleOutlined />,
            // content: 'ยืนยันการแก้ไขข้อมูลร้าน',
            okText: 'บันทึก',
            cancelText: 'ยกเลิก',
            onOk() {
                console.log('OK');
                handleSaveStatusShop()
            },
        });
    };
    const mergeConfirm = (toShop) => {
        console.log("toShop: ", toShop);
        console.log("shop: ", shopData);
        Modal.confirm({
            title: `ต้องการ Merge จากร้าน ${shopData.shopName}(${shopData.shop_id}) ไปยัง ร้าน ${toShop.shopName}(${toShop.shop_id}) ใช่หรือไม่?`,
            icon: <ExclamationCircleOutlined />,
            // content: 'ยืนยันการแก้ไขข้อมูลร้าน',
            okText: 'บันทึก',
            cancelText: 'ยกเลิก',
            onOk() {
                handleMergeShop(shopData.shop_id, toShop.shop_id);
            },
        });
    };

    const setNearbyShopObjectData = async (shop) => {
        // console.log("shopdata", shopData);
        return {
            key: shop.sid,
            shop_id: shop.sid,
            shopName: shop.title,
            score: shop.score,
            distance: shop.desc
        }
    }

    const nearbyShopDataColumns = [
        {
            key: "shop_id",
            title: "Shop ID",
            dataIndex: "shop_id",
            // width: "32%",
        },
        {
            key: "shopName",
            title: "Shop Name",
            dataIndex: "shopName",
        },
        {
            key: "score",
            title: "Score",
            dataIndex: "score",
        },
        {
            key: "distance",
            title: "ระยะห่าง",
            dataIndex: "distance",
        },
        {
            key: "action",
            title: "Action",
            dataIndex: "action",
            render: (__, record) => {
                return (
                    <Button
                        onClick={() => mergeConfirm(record)}
                    // onClick={mergeConfirm(shop.title, shop.sid, shop.title, shop.sid)}
                    >
                        <span>Merge</span>
                    </Button>
                )
            },
        }
    ];

    useEffect(() => {
        getShop(params.id);
    }, []);

    return (
        <>
            <Row gutter={[24, 0]}>
                <Col span={24} md={24} className="mb-24">
                    <Card
                        className="header-solid h-full"
                        bordered={false}
                        title={[<h6 className="font-semibold m-0">รายละเอียดร้านค้า</h6>]}
                        bodyStyle={{ paddingTop: "0" }}
                    >
                        <Row gutter={[24, 24]}>
                            {shopData &&
                                <Col span={24}>
                                    <Card className="card-billing-info" bordered="false">
                                        <div className="col-info">
                                            <Descriptions title="ข้อมูลร้านค้า">
                                                <Descriptions.Item label="Shop ID" span={3}>
                                                    {shopData.shop_id}
                                                </Descriptions.Item>

                                                <Descriptions.Item label="ชื่อ" span={3}>
                                                    {shopData.shopName}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="User ID" span={3}>
                                                    {shopData.user_id}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="recommend" span={3}>
                                                    {shopData.recommend}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="tel" span={3}>
                                                    {shopData.tel}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="address" span={3}>
                                                    {shopData.address}
                                                </Descriptions.Item>

                                                <Descriptions.Item label="latitude" span={3}>
                                                    {shopData.latitude}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="longitude" span={3}>
                                                    {shopData.longitude}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="ยืนยันร้านค้า" span={3}>
                                                    {shopStatusCodeData == "1" ?
                                                        (<Select defaultValue="2" style={{ width: 120 }} onChange={handleChange}>
                                                            <Option value="2">Approve</Option>
                                                            <Option value="3">Reject</Option>
                                                        </Select>) :
                                                        shopStatusCodeData == "2" ? "Approve" :
                                                            shopStatusCodeData == "3" ? "Reject" :
                                                                shopStatusCodeData == "4" ? "Dupicated" : ""
                                                    }
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </div>
                                        {
                                            // isStatusEdit &&
                                            shopStatusCodeData == "1" &&
                                            <div className="col-action">
                                                <Button style={{ color: "green" }} type="link" className="darkbtn" onClick={() => confirm()}>
                                                    {pencil} บันทึก
                                                </Button>
                                            </div>

                                        }
                                    </Card>
                                </Col>
                            }
                        </Row>
                    </Card>
                </Col>

                {
                    shopStatusCodeData == "1" &&
                    <Col span={24} md={24} className="mb-24">
                        <Card
                            className="header-solid h-full"
                            bordered={false}
                            title={[<h6 className="font-semibold m-0">ร้านค้าใกล้เคียง</h6>]}
                            bodyStyle={{ paddingTop: "0" }}
                        >
                            <Row gutter={[24, 24]} >
                                <Col span={24} key={0}>
                                    <div className="table-responsive">
                                        <Table
                                            // rowKey="sid"
                                            columns={nearbyShopDataColumns}
                                            dataSource={nearbyShopData}
                                            pagination={false}
                                            className="ant-border-space"
                                        // onClick: (e) =>findId(+e.target.value)
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                }
            </Row>
        </>
    )
}

export default ShopApprovalBYShopId;
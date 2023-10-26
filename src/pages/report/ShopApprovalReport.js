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
    DatePicker
} from "antd";

import { useEffect, useState } from "react";

import notificationWithIcon from "../../utils/notificationWithIcon";
import moment from 'moment';
import { getShopReportService } from "../../services/shop.service";
// import { ExcelDownload } from "../../utils/export-excel";

const { RangePicker } = DatePicker;
const { Search } = Input;

const ShopApprovalReport = () => {
    const [searchForm] = Form.useForm();

    const [shopApprovalData, setShopApprovalData] = useState([]);;


    const shopApprovalReportColumns = [
        {
            title: "Date",
            key: "date",
            dataIndex: "date",
        },
        {
            title: "All Shop",
            key: "all_shop",
            dataIndex: "all_shop",
        },
        {
            title: "Non-Approved Shop",
            key: "non_approved_shop",
            dataIndex: "non_approved_shop",
        },
        {
            title: "Approved Shop",
            key: "approved_shop",
            dataIndex: "approved_shop",
        },
        {
            title: "Rejected Shop",
            key: "rejected_shop",
            dataIndex: "rejected_shop",
        },
        {
            title: "Merged Shop",
            key: "merged_shop",
            dataIndex: "merged_shop",
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
        }
    ];


    const getShopReport = async (dateData) => {
        let data = [];
        data = await getShopReportService(dateData.start_date, dateData.end_date);


        const shopApprovalArray = [];
        if (data) {
            const shopApprovals = data;
            for (const shopApprovalObj of shopApprovals) {
                const shopApprovalObject = await setShopApprovalOjectData(shopApprovalObj);
                shopApprovalArray.push(shopApprovalObject);
            }
        }
        setShopApprovalData(shopApprovalArray);
    }

    const setShopApprovalOjectData = async (shopReport) => {
        return {
            key: shopReport.date,
            date: moment(shopReport.date).format("YYYY-MM-DD"),
            all_shop: shopReport.all_shop,
            approved_shop: shopReport.approved_shop,
            non_approved_shop: shopReport.non_approved_shop,
            rejected_shop: shopReport.rejected_shop,
            merged_shop: shopReport.merged_shop,
            status: shopReport.status,
        }
    }


    const onFinish = (values) => {
        values.start_date = moment(values.date[0]).format("YYYY-MM-DD");
        values.end_date = moment(values.date[1]).format("YYYY-MM-DD");
        // console.log("values: ", values);
        getShopReport(values);

    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    useEffect(() => {

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
                        title="Shop Approval Report"
                    >
                        <Form
                            name="basic"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            form={searchForm}
                            scrollToFirstError={true}
                            layout="inline"
                        >
                            <Form.Item style={{ marginBottom: "10px" }}
                                name="date"
                                label='Date'
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required',
                                    },
                                ]}>
                                < RangePicker
                                    size={"large"}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                            <Button type="primary" style={{ background: "rgb(96, 184, 88)", borderRadius: "10px" }} htmlType="submit">Submit</Button>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 0]}>
                <Col xs="24" xl={24}>
                    <Card
                        className="header-solid h-full"
                        // title="Shop Approval Report"
                        // extra={
                        //     <>
                        //         {
                        //             shopApprovalData.length !== 0 &&
                        //             <ExcelDownload column={shopApprovalReportColumns} data={shopApprovalData} />
                        //         }
                        //     </>
                        // }
                    >
                        <div className="table-responsive">
                            <Table
                                columns={shopApprovalReportColumns}
                                dataSource={shopApprovalData}
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

export default ShopApprovalReport;
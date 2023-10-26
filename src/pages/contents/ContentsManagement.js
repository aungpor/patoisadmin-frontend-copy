import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Radio,
    Table,
    DatePicker,
    Button,
} from "antd";
import moment from 'moment';
import { getContentList } from "../../services/content.service";

function ContentsManagement() {
    const [contentData, setContentData] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const fetchContentListData = async () => {

        const result = await getContentList(tableParams)
        if (result?.data) {
            let i = ((tableParams.pagination.current - 1) * 10) + 1
            const setContentList = result?.data.map((item, index) => {
                return {
                    index: (i++),
                    cover: item?.image_desktop_list ? item?.image_desktop_url : item?.image_url,
                    content_name: item?.content_name,
                    sub_category: item?.sub_category_name,
                    started_date: item?.start_date,
                    ended_date: item?.end_date,
                    writer_name: "Administrator",
                    content_id: item?.content_id
                }
            })
            setContentData(setContentList)
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: result?.total,
                    // 200 is mock data, you should read it from server
                    // total: data.totalCount,
                },
            });
        }
    }

    useEffect(() => {
        fetchContentListData()
    }, [JSON.stringify(tableParams)])

    const columns = [
        {
            title: 'No.',
            key: 'index',
            dataIndex: "index",

            width: "5%"
        },
        {
            title: "Cover",
            dataIndex: "cover",
            key: "cover",
            render: (_, image) => {
                return (

                    <>
                        <img src={image?.cover} />
                    </>
                )
            }
        },
        {
            title: "Content Name",
            dataIndex: "content_name",
            key: "content_name",
            width: "20%",
            render: (_, record) => {
                return (
                    <>
                        {record?.content_name?.length > 34 ? record?.content_name?.substring(0, 34) + ' ...' : record?.content_name}
                    </>
                )
            }
        },

        {
            title: "Sub Category",
            key: "sub_category",
            dataIndex: "sub_category",
            width: "20%",
            render: (_, record) => {
                return (
                    <>
                    {record?.sub_category?.length > 23 ? record?.sub_category?.substring(0, 23) + ' ...' : record?.sub_category}
                    </>
                )
            }
            // filteredValue: filteredInfo.date || null,

        },
        {
            title: "Started Date",
            key: "started_date",
            dataIndex: "started_date",
            width: "20%"
        },
        {
            title: "Ended Date",
            key: "ended_date",
            dataIndex: "ended_date",
            width: "20%"
        },
        {
            title: "Writer Name",
            key: "writer_name",
            dataIndex: "writer_name",
            width: "5%"
        },
        {
            title: "",
            key: "action",
            fixed: 'right',
            width: 100,
            dataIndex: "action",
            render: (_, record) => {
                return (
                    <>
                        <Link to={`/edit-content/${record.content_id}/1`}><Button ghost type="warning"> Edit</Button></Link>
                        <Button onClick={() => window.open(`${process.env.REACT_APP_PATOIS_OFFICAL_WEB}/contents/${record.content_id}?contentType=1`, '_blank')}> View</Button>
                    </>
                )
            }
        },

    ];

    const handleTableChange = (pagination, filters, sorter) => {
        console.log(pagination);
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

    };

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Contents"
                        >
                            <Col span={12} offset={21}>
                                <a href="/create-contents"><Button className="ant-btn ant-btn-primary">Create Content</Button></a>
                            </Col>
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={contentData}
                                    className="ant-border-space"
                                    pagination={tableParams.pagination}
                                    onChange={handleTableChange}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default ContentsManagement;
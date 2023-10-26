import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
    Row,
    Col,
    Card,
    Radio,
    Table,
    DatePicker,
    Modal,
    notification,
} from "antd";
import Button from "antd-button-color"
import ReactTags from 'react-tag-autocomplete'
import moment from 'moment';
import ModalPopupEdit from "../../components/modal/ModalPopupEdit"
import { getListShopKeyword, editShopKeyword } from "../../services/seo.service";
import 'antd-button-color/dist/css/style.css';
import './style.scss'

function KeywordManagement() {
    const [shopData, setShopData] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const [modalVisible, setModalVisible] = useState(false)
    const [keywords, setKeywords] = useState([])
    const [inputKeywords, setInputKeywords] = useState([])
    const [formData, setFormData] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const reactTags = useRef()

    const fetchKeywordListData = async () => {

        const result = await getListShopKeyword(tableParams)
        console.log(result);
        if (result) {
            let i = ((tableParams.pagination.current - 1) * 10) + 1
            const setContentList = result?.data.map((item) => {
                return {
                    index: (i)++,
                    shop_id: item.shop_id,
                    shopName: item?.shopName,
                    seo_keyword: item?.seo_keyword
                }
            })
            setShopData(setContentList)
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
        fetchKeywordListData()
    }, [JSON.stringify(tableParams)])

    const columns = [
        {
            title: 'No.',
            key: 'index',
            dataIndex: "index",
        },
        {
            title: "Shop name",
            dataIndex: "shopName",
            key: "shopName",
            width: "40%",
            render: (_, record) => {
                return (
                    <>
                        {record?.shopName?.length > 34 ? record?.shopName?.substring(0, 34) + ' ...' : record?.shopName}
                    </>
                )
            }
        },
        {
            title: "Keyword",
            dataIndex: "seo_keyword",
            key: "seo_keyword",
            width: "40%",
            render: (_, record) => {
                return (
                    <>
                        {record?.seo_keyword?.length > 34 ? record?.seo_keyword?.substring(0, 34) + ' ...' : record?.seo_keyword}
                    </>
                )
            }
        },
        {
            title: "",
            key: "action",
            fixed: 'right',
            dataIndex: "action",
            render: (_, record, index) => {
                return (
                    <>
                        <Button onClick={() => onEdit(index, record)} ghost type="warning"> Edit</Button>
                    </>
                )
            }
        },

    ];

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

    };

    const onEdit = (index, record) => {
        if (record?.seo_keyword !== null && record?.seo_keyword !== undefined && record?.seo_keyword !== '') {
            const setArrKeyword = record?.seo_keyword?.split(',').map((val, index) => {
                return {
                    id: index,
                    name: val
                }
            })

            setInputKeywords(setArrKeyword)
            setKeywords(setArrKeyword)
        }
        setFormData({
            shop_id: record.shop_id,
            seo_keyword: record?.seo_keyword?.toString()
        })
        setModalVisible(true)
    }

    const onAddition = useCallback((newTag) => {
        setKeywords([...keywords, newTag])
        setInputKeywords([...inputKeywords, newTag])
    }, [keywords, inputKeywords])

    const onDelete = useCallback((tagIndex) => {
        setKeywords(keywords.filter((_, i) => i !== tagIndex))
        setInputKeywords(inputKeywords.filter((_, i) => i !== tagIndex))
    }, [keywords, inputKeywords])

    const handleCloseModal = () => {
        setInputKeywords([])
        setKeywords([])
        setFormData({})
        setModalVisible(false)
    }

    const handleSubmitModal = async () => {
        try {
            setIsLoading(true)
            const keywordString = inputKeywords.map((item) => item.name).join(",")
            formData.seo_keyword = keywordString
            const editShopKeywordRes = await editShopKeyword(formData)
            console.log(formData);

            if (editShopKeywordRes.ResponseCode === 200) {
                notification.success({
                    message: 'Edit shop keyword successful'
                });
                setInputKeywords([])
                setKeywords([])
                setFormData({})
                fetchKeywordListData()
                setModalVisible(false)
                setIsLoading(false)
            }
        } catch (error) {
            notification.error({
                message: 'Edit shop keyword failed'
            });
            setIsLoading(false)
        }
    }
    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="SEO Keyword"
                        >
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={shopData}
                                    className="ant-border-space"
                                    pagination={tableParams.pagination}
                                    onChange={handleTableChange}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Modal footer={false} title="Edit Keyword" visible={modalVisible} onCancel={() => handleCloseModal()}>
                    <div className="m-10px">
                        <ReactTags
                            ref={reactTags}
                            tags={keywords}
                            onDelete={onDelete}
                            onAddition={onAddition}
                            allowNew
                        />
                    </div>
                    <div className="text-right m-10px m-bottom-0">
                        <Button className="m-right-10px" onClick={() => handleCloseModal()} size="large" type="danger">Cancel</Button>
                        <Button size="large" onClick={() => handleSubmitModal()} loading={isLoading} type="success">Save</Button>
                    </div>
                </Modal>
            </div>
        </>
    );
}

export default KeywordManagement;
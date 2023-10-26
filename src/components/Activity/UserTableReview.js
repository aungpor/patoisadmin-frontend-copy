import {
    Select,
    Table,
    Input,
    Switch,
    notification
} from "antd";
import { useEffect, useState } from "react";
import moment from 'moment';

import ModalCustomClose from "../modal/ModalCustomClose";

import { getReviewHistory } from '../../services/user.service'
import { updateReviewStatus } from '../../services/shop.service'
import { getPointHistoryInfo } from "../../services/maxCard.service";

import './style.scss'

const { Search } = Input;

function UserTableReview(props) {

    const [userId, setUserId] = useState()
    const [pageNumberReview, setPageNumberReview] = useState(1)
    const [rowPerPageReview, setRowPerPageReview] = useState(20)
    const [dataReview, setDataReview] = useState([])
    const [searchText, setSearchText] = useState('')
    const [searchType, setSearchType] = useState('ALL')
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 20,
        },
    });
    const [isLoading, setIsLoading] = useState(true)
    const [visiblePoint, setVisiblePoint] = useState(false)
    const [pointData, setPointData] = useState({})

    useEffect(() => {
        if (props?.userId) handleInit()
    }, [props])

    const handleInit = async () => {
        setUserId(props?.userId)
        await fetchgetReviewHistory(props?.userId, searchText, pageNumberReview, rowPerPageReview, searchType)
    }

    const fetchgetReviewHistory = async (id, text, pageNumber, rowPerPage, type) => {
        setIsLoading(true)
        let reviewRes = await getReviewHistory(id, text, pageNumber, rowPerPage, type)
        if (!reviewRes?.data) return

        setDataReview((val) => [...reviewRes?.data])
        setTableParams((tableParams) => {
            return {
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    pageSize: rowPerPage,
                    total: reviewRes?.total,
                },
            }
        });
        setIsLoading(false)
    }

    const columns = [
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (_, val) => renderDate(val)
        },
        {
            title: 'Shop Name',
            dataIndex: 'shop_name',
            key: 'shop_name',
            width: '15%',
            render: (_, val) => renderShopName(val)
        },
        {
            title: 'Shop ID',
            dataIndex: 'shop_id',
            key: 'shop_id',
        },
        {
            title: 'Type',
            dataIndex: 'reviewType',
            key: 'reviewType',
        },
        {
            title: 'Review Message',
            dataIndex: 'review',
            key: 'review',
            width: '20%'
        },
        {
            title: 'Picture',
            dataIndex: 'review_thumbnail_url',
            key: 'review_thumbnail_url',
            width: '20%',
            render: (_, val) => renderImage(val),
        },
        {
            title: 'Status',
            dataIndex: 'shop_status_name',
            key: 'shop_status_name',
            render: (_, val) => renderStatus(val)
        },
        {
            title: 'Point',
            dataIndex: 'maxPoint',
            key: 'maxPoint',
            render: (_, val) => renderPoint(val)
        },
        {
            title: '',
            dataIndex: 'active_review',
            key: 'active_review',
            render: (_, val) => renderStatusbar(val),
        },
    ];

    const onClickActive = async (val) => {
        let statusRes = await updateReviewStatus(val?.post_review_id, val?.active_review ? 'N' : 'Y')
        if (statusRes) {
            notification.success({
                description: 'Changes have been saved.',
                message: 'Success!'
            });
        } else {
            notification.error({
                message: 'Failed Changes'
            });
        }
    }

    const onClickPoint = async (val) => {
        if (!val?.interface_log_id) return
        let res = await getPointHistoryInfo(val?.interface_log_id)
        if (!res[0]) {
            notification.error({
                message: 'Failed Changes'
            });
            return
        }

        setPointData(res[0])
        setVisiblePoint(true)
    }

    const handleSearch = async (text) => {
        handleClearStage()
        setSearchText(text)
        await fetchgetReviewHistory(userId, text, pageNumberReview, rowPerPageReview, searchType)
    }

    const handleClearStage = () => {
        setTableParams({
            pagination: {
                pageSize: rowPerPageReview,
                current: 1,
                total: 1,
            },
        })
        setDataReview([])
        setPageNumberReview(1)
    }

    const handleChangeType = async (event) => {
        handleClearStage()
        setSearchType(event)
        await fetchgetReviewHistory(userId, searchText, pageNumberReview, rowPerPageReview, event)
    }

    const handleChangePage = async (event) => {
        handleClearStage()
        setRowPerPageReview(event)
        await fetchgetReviewHistory(userId, searchText, pageNumberReview, event, searchType)
    }

    const handleTableChange = async (pagination, filters, sorter) => {
        setDataReview([])
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        await fetchgetReviewHistory(userId, searchText, pagination?.current, rowPerPageReview, searchType)
    };

    const renderDate = (val) => {
        const date = moment(val?.created_at).format('DD-MM-YYYY');
        const time = moment(val?.created_at).format('hh:mm:ss');

        return <div className="date-item" style={{ whiteSpace: 'nowrap' }}>
            <p className="day-text">{date}</p>
            <p className="time-text">{time}</p>
        </div>
    }

    const renderShopName = (val) => {
        return <div className="shop-name-item">
            <p className="name-text">{val?.shop_name}</p>
            <p className="location-text">{`(${val?.latitude},${val?.longitude})`}</p>
        </div>
    }

    const renderImage = (val) => {
        if (!val?.review_thumbnail_url) return

        let imageUrl = val?.review_thumbnail_url?.split(',')
        return <div className="img-item-warpper">
            {
                imageUrl.map((img) => <img src={img} className="w-full"></img>)
            }
        </div>
    }

    const renderStatus = (val) => {
        if (val?.shop_status_code == '3') return <p className="" style={{ color: '#E95636' }}>{val?.shop_status_name}</p>
        return <span className="" style={{ color: '' }}>{val?.shop_status_name}</span>
    }

    const renderPoint = (val) => {
        if (val?.shop_status_code == '3') return <p className="" style={{ color: '#E95636' }}>{val?.maxPoint}</p>
        return <span className="" style={{ color: '', cursor: 'pointer' }} onClick={() => onClickPoint(val)}>{val?.maxPoint}</span>
    }

    const renderStatusbar = (val) => {
        return <Switch defaultChecked={val?.active_review} onChange={() => onClickActive(val)} />
    }

    return (
        <div className="InquiryUserTable-warpper">
            <div className="search-warpper">
                <div>
                    <Search
                        // prefix={<SearchOutlined />}
                        placeholder="Search Shop Name, Shop ID"
                        enterButton="Search"
                        onSearch={(event) => handleSearch(event)}
                        style={{
                            width: "22rem",
                        }}
                    />
                    <Select
                        defaultValue="ALL"
                        style={{ width: '13.625rem', marginLeft: '1rem' }}
                        onChange={handleChangeType}
                        options={[
                            { value: 'ALL', label: 'ALL' },
                            { value: 'CREATE', label: 'CREATE' },
                            { value: 'REVIEW', label: 'REVIEW' }
                        ]}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight: 0 }}>
                    <span>Record</span>
                    <Select
                        defaultValue="20"
                        style={{ width: '6.3125rem', marginLeft: '1rem' }}
                        onChange={handleChangePage}
                        options={[
                            { value: '10', label: '10' },
                            { value: '20', label: '20' },
                            { value: '30', label: '30' },
                            { value: '40', label: '40' },
                            { value: '50', label: '50' }
                        ]}
                    />
                </div>
            </div>
            <Table
                style={{ marginTop: '1.25rem' }}
                columns={columns}
                dataSource={dataReview}
                className="ant-border-space user-table-warpper"
                pagination={{
                    ...tableParams.pagination,
                }}
                showSizeChanger={false}
                onChange={handleTableChange}
                loading={isLoading}
            />
            <ModalCustomClose isVisible={visiblePoint} onClose={() => setVisiblePoint(false)} className="" style={{ width: '70vw' }}>
                <div className="modal-review-style" style={{ width: '80vw', height: 'auto', background: 'white', borderRadius: '0.75rem', padding: '1.5rem' }}>
                    <div>
                        <span className="header-text">
                            Review History Report
                        </span>
                        <div style={{ width: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'inline-flex', marginTop: '1.25rem' }}>
                            <div style={{ color: '#8C8C8C', fontSize: 12, fontFamily: 'Open Sans', fontWeight: '700', wordWrap: 'break-word' }}>Points History</div>
                            <div style={{ width: '100%', alignSelf: 'stretch', height: 'auto', borderRadius: 8, overflow: 'hidden', border: '1px #C7C7C7 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex' }}>
                                <div style={{ alignSelf: 'stretch', padding: 12, background: 'white', borderBottom: '1px #C7C7C7 solid', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 16, display: 'inline-flex' }}>
                                    <div style={{ width: '10%', color: '#8C8C8C', fontSize: 12, fontFamily: 'Open Sans', fontWeight: '700', wordWrap: 'break-word' }}>Ref.</div>
                                    <div style={{ width: '10%', color: '#8C8C8C', fontSize: 12, fontFamily: 'Open Sans', fontWeight: '700', wordWrap: 'break-word' }}>Type</div>
                                    <div style={{ width: '10%', color: '#8C8C8C', fontSize: 12, fontFamily: 'Open Sans', fontWeight: '700', wordWrap: 'break-word' }}>Date</div>
                                    <div style={{ width: '40%', color: '#8C8C8C', fontSize: 12, fontFamily: 'Open Sans', fontWeight: '700', wordWrap: 'break-word' }}>Status</div>
                                    <div style={{ width: '10%', color: '#8C8C8C', fontSize: 12, fontFamily: 'Open Sans', fontWeight: '700', wordWrap: 'break-word' }}>Points</div>
                                    <div style={{ width: '20%', color: '#8C8C8C', fontSize: 12, fontFamily: 'Open Sans', fontWeight: '700', wordWrap: 'break-word' }}>Earned Points</div>
                                </div>
                                <div style={{ alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, background: 'white', justifyContent: 'flex-start', alignItems: 'center', gap: 16, display: 'inline-flex' }}>
                                    <div style={{ width: '10%', color: '#303030', fontSize: 13, fontFamily: 'Open Sans', fontWeight: '400', wordWrap: 'break-word' }}>{pointData?.ref}</div>
                                    <div style={{ width: '10%', color: '#303030', fontSize: 13, fontFamily: 'Open Sans', fontWeight: '400', wordWrap: 'break-word' }}>{pointData?.type}</div>
                                    <div style={{ width: '10%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}>
                                        <div style={{ alignSelf: 'stretch', color: '#303030', fontSize: 13, fontFamily: 'Open Sans', fontWeight: '400', wordWrap: 'break-word' }}>{moment(pointData?.created_at).format('DD-MM-YYYY')}</div>
                                        <div style={{ alignSelf: 'stretch', color: '#8C8C8C', fontSize: 12, fontFamily: 'Open Sans', fontWeight: '400', wordWrap: 'break-word' }}>{moment(pointData?.created_at).format('hh:mm:ss')}</div>
                                    </div>
                                    <div style={{ width: '40%', color: '#303030', fontSize: 13, fontFamily: 'Open Sans', fontWeight: '400', wordWrap: 'break-word' }}>{pointData?.status}</div>
                                    <div style={{ width: '10%', color: '#303030', fontSize: 13, fontFamily: 'Open Sans', fontWeight: '400', wordWrap: 'break-word' }}>{pointData?.point}</div>
                                    <div style={{ width: '20%', color: '#303030', fontSize: 13, fontFamily: 'Open Sans', fontWeight: '400', wordWrap: 'break-word' }}>{pointData?.earned_points || '-'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalCustomClose>
        </div>
    )
}

export default UserTableReview;
import {
    Select,
    Table,
} from "antd";
import { useEffect, useState } from "react";
import moment from 'moment';

import { getPointHistory } from "../../services/maxCard.service";

import './style.scss'

function UserTablePoints(props) {

    const [userId, setUserId] = useState()
    const [pageNumberReview, setPageNumberReview] = useState(1)
    const [rowPerPageReview, setRowPerPageReview] = useState(20)
    const [dataReview, setDataReview] = useState([])
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 20,
        },
    });
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (props?.userId) handleInit()
    }, [props])

    const handleInit = async () => {
        setUserId(props?.userId)
        await fetchgetReviewHistory(props?.userId, pageNumberReview, rowPerPageReview)
    }

    const fetchgetReviewHistory = async (id, pageNumber, rowPerPage) => {
        setIsLoading(true)
        let reviewRes = await getPointHistory(id, pageNumber, rowPerPage)
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
            title: 'Ref.',
            dataIndex: 'ref',
            key: 'ref',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            width: '20%',
            render: (_, val) => renderDate(val)
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',

            width: '40%'
        },
        {
            title: 'Points',
            dataIndex: 'point',
            key: 'point',
        },
        {
            title: 'Earned Points',
            dataIndex: 'earned_points',
            key: 'earned_points',
            render: (_, val) => renderEarnedPoint(val)
        },
    ];

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

    const handleChangePage = async (event) => {
        handleClearStage()
        setRowPerPageReview(event)
        await fetchgetReviewHistory(userId, pageNumberReview, event)
    }

    const handleTableChange = async (pagination, filters, sorter) => {
        setDataReview([])
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        await fetchgetReviewHistory(userId, pagination?.current, rowPerPageReview)
    };

    const renderDate = (val) => {
        const date = moment(val?.created_at).format('DD-MM-YYYY');
        const time = moment(val?.created_at).format('hh:mm:ss');

        return <div className="date-item" style={{ whiteSpace: 'nowrap', display: 'flex' }}>
            <p className="day-text">{date}</p>
            <p className="time-text" style={{ marginLeft: 5, lineHeight: 'unset' }}>Time {time}</p>
        </div>
    }

    const renderEarnedPoint = (val) => {
        if (!val?.earned_points) return '-'
        return val?.earned_points
    }


    return (
        <div className="InquiryUserTable-warpper">
            <div className="search-warpper">
                <div>

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
        </div>
    )
}

export default UserTablePoints;
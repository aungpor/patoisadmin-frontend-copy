import { useEffect, useState } from "react";
import {
    Table,
    Input,
    Col,
    Card,
    Form,
    notification,
    Space
} from "antd";
import Button from "antd-button-color"
import { MenuOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move'
import moment from 'moment';
import { getContentCarouselBanner, getImageAndTitleByContentId, editContentCarouselBanner } from "../../services/content.service";
import { useDebouncedCallback } from 'use-debounce';
import './style.scss'
import 'antd/dist/antd.css';
import 'antd-button-color/dist/css/style.css';

function ConfigContentCarouselBannerTable() {

    const [contentData, setContentData] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 6,
        },
    });

    const [disableSaveBtn, setDisableSaveBtn] = useState(true)

    const [form] = Form.useForm();

    form.setFieldsValue({ contentData: contentData });

    const DragHandle = SortableHandle(() => (
        <svg xmlns="http://www.w3.org/2000/svg" style={{ cursor: "grab" }} height="1.5em" viewBox="0 0 448 512"><path d="M48 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H48zm0 192c-17.7 0-32 14.3-32 32s14.3 32 32 32H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H48z" /></svg>
    ));

    const fetchContentListData = async () => {
        const result = await getContentCarouselBanner(tableParams)
        const tempContentList = []
        for (let index = 0; index < 6; index++) {
            tempContentList.push({
                index: index + 1,
                title: '',
                content_url: '',
                content_id: '',
                image_desktop_url: ''
            })
        }

        const setContentList = tempContentList.map((tempItem, index) => {
            return {
                index: index + 1,
                title: result?.data ? result?.data[index]?.title : '',
                content_url: result?.data ? result?.data[index]?.content_url : '',
                content_id: result?.data ? result?.data[index]?.content_url?.substr(result?.data[index]?.content_url?.indexOf('/contents/'), 35).split('/')[2].split('-')[0] : '',
                image_desktop_url: result?.data ? result?.data[index]?.image_desktop_url : result?.data[index]?.image_url || ''
            }
        })

        setContentData(setContentList)
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                total: 5,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
            },
        });
    }

    useEffect(() => {
        fetchContentListData()
    }, [JSON.stringify(tableParams)])

    const columns = [
        {
            title: 'No.',
            key: 'index',
            dataIndex: "index",
            width: "1%"
        },
        {
            title: "Banner",
            dataIndex: "image_desktop_url",
            key: "image_desktop_url",
            width: "9%",
            render: (_, image) => {
                return (

                    <>
                        {image?.image_desktop_url ? <img src={image?.image_desktop_url} /> :
                            <Space style={{ background: "#f2f2f3", width: "100%", padding: "20px", borderRadius: "5px", justifyContent: 'center' }}>
                                <small style={{ color: "#767676" }}>ยังไม่มีภาพ</small>
                            </Space>
                        }
                    </>
                )
            }
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            className: 'drag-visible drag-title-size',
            width: "15%",
            render: (_, record) => {
                return (
                    <>
                        {record?.title?.length > 35 ? record?.title?.substring(0, 35) + ' ...' : record?.title}
                    </>
                )
            }
        },
        {
            title: "Content URL",
            key: "content_url",
            dataIndex: "content_url",
            width: "25%",
            render: (_, record, index) => {
                return (
                    <>
                        <Input pattern="https?://.+" defaultValue={record?.content_url} onChange={(e) => debounced(e, index)} />
                    </>
                )
            }
            // filteredValue: filteredInfo.date || null,
        },
        {
            title: '',
            dataIndex: 'sort',
            width: "1%",
            className: 'drag-visible',
            render: () => <DragHandle />,
        }
    ];

    const SortableItem = SortableElement((props) => <tr {...props} />);
    const SortableBody = SortableContainer((props) => <tbody {...props} />);

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setDisableSaveBtn(false)
        if (oldIndex !== newIndex) {
            const newData = arrayMoveImmutable(contentData.slice(), oldIndex, newIndex).filter(
                (el) => !!el,
            );
            console.log('Sorted items: ', newData);
            setContentData(newData);
        }
    };

    const DraggableContainer = (props) => (
        <SortableBody
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={onSortEnd}
            {...props}
        />
    );

    const DraggableBodyRow = ({ className, style, ...restProps }) => {
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = contentData.findIndex((x) => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };

    const handleTableChange = (pagination, filters, sorter) => {
        console.log(pagination);
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

    };

    const onSave = async (data) => {
        try {
            const tempData = []
            data.contentData.filter((value) => value?.content_id !== undefined).map((item, index) => {
                tempData.push({
                    title: item.title,
                    content_id: item.content_id,
                    content_url: item.content_url,
                    order_no: index + 1,
                    create_by: 6003,
                    update_by: 6003
                })
            })

            const updateData = await editContentCarouselBanner(tempData)

            if (updateData.ResponseCode === 200) {
                notification.success({
                    message: 'Save content carousel banner successful'
                });
                fetchContentListData()
                setDisableSaveBtn(true)
            }

        } catch (error) {
            notification.error({
                message: 'Failed save content carousel banner'
            });
        }
    }

    const debounced = useDebouncedCallback(
        async (e, index) => {
            let inputUrl = decodeURI(e?.target?.value)
            let getContentId = inputUrl ? inputUrl?.substr(inputUrl?.indexOf('/contents/'), 35)?.split('/')[2]?.split('-')[0] : ''
            const getContentImgAndTitle = await getImageAndTitleByContentId(getContentId)
            contentData[index].content_url = inputUrl
            contentData[index].image_desktop_url = getContentImgAndTitle?.data?.image_desktop_url
            contentData[index].title = getContentImgAndTitle?.data?.title
            contentData[index].content_id = getContentId
            setContentData([...contentData])
            setDisableSaveBtn(false)
        },
        1000
    )

    return (
        <>
            <div className="tabled">
                <Col>
                    <Card
                        bordered={false}
                        className="criclebox tablespace mb-24"
                        title="Content Carousel Banner"
                    >
                        <div className="table-responsive">
                            <Form onFinish={onSave} form={form}>
                                <Form.Item name="contentData">
                                    <Table
                                        columns={columns}
                                        onSubmit={e => e.preventDefault()}
                                        dataSource={contentData}
                                        rowKey="index"
                                        className="ant-border-space"
                                        // fields={[
                                        //     {
                                        //         name: ["content_name"],
                                        //         value: formDraft?.content_name,
                                        //     }
                                        // ]}
                                        // pagination={tableParams.pagination}
                                        onChange={handleTableChange}
                                        pagination={{
                                            position: ['none', 'none'],
                                        }}
                                        components={{
                                            body: {
                                                wrapper: DraggableContainer,
                                                row: DraggableBodyRow,
                                            },
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Col span={12} offset={1} className="mb-24 margin-top-20px">
                                        <Button disabled={disableSaveBtn} size={"large"} type="success" className="btn-save-padding-lr-35px" onClick={() => form.submit()}>Save</Button>
                                    </Col>
                                </Form.Item>
                            </Form>
                        </div>
                    </Card>
                </Col>
            </div>
        </>
    );
}

export default ConfigContentCarouselBannerTable;

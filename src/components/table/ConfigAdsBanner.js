import { useEffect, useState } from "react";
import {
    Table,
    Input,
    Col,
    Card,
    Form,
    notification,
    message,
    Upload,
    Space
} from "antd";
import Button from "antd-button-color"
import { MenuOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move'
import moment from 'moment';
import { useDebouncedCallback } from 'use-debounce';
import { getAdsBanner, editContentAdsBanner } from "../../services/content.service";
import './style.scss'
import 'antd/dist/antd.css';
import 'antd-button-color/dist/css/style.css';

function ConfigAdsBanner() {

    const [contentData, setContentData] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
    });
    const [disableSaveBtn, setDisableSaveBtn] = useState(true)

    const [form] = Form.useForm();

    form.setFieldsValue({ contentData: contentData });

    const DragHandle = SortableHandle(() => (
        <svg xmlns="http://www.w3.org/2000/svg" style={{ cursor: "grab" }} height="1.5em" viewBox="0 0 448 512"><path d="M48 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H48zm0 192c-17.7 0-32 14.3-32 32s14.3 32 32 32H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H48z" /></svg>
    ));

    const fetchContentListData = async () => {
        const result = await getAdsBanner(tableParams)
        const tempContentList = []
        for (let index = 0; index < 5; index++) {
            tempContentList.push({
                index: index + 1,
                ads_banner_id: '',
                url: '',
                image_id: '',
                image_id_desktop: '',
                image_desktop_url: '',
                image_url: ''
            })
        }
        const setContentList = tempContentList.map((item, index) => {
            return {
                index: index + 1,
                ads_banner_id: result?.data ? result?.data[index]?.ads_banner_id : '',
                url: result?.data ? result?.data[index]?.url : '',
                image_id: result?.data ? result?.data[index]?.image_id_desktop : '',
                image_id_desktop: result?.data ? result?.data[index]?.image_id_desktop : '',
                image_desktop_url: result?.data ? result?.data[index]?.image_desktop_url : '',
                image_url: result?.data ? result?.data[index]?.image_url : ''
            }
        })
        console.log('setContentList', setContentList);
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
                        {image?.image_url ? <img src={image?.image_url} /> :
                            <Space style={{ background: "#f2f2f3", width: "100%", padding: "25px", borderRadius: "5px", justifyContent: 'center' }}>
                                <small style={{ color: "#767676" }}>ยังไม่มีภาพ</small>
                            </Space>
                        }
                        <br />
                        <br />
                        {image?.image_desktop_url ? <img src={image?.image_desktop_url} /> :
                            <Space style={{ background: "#f2f2f3", width: "100%", padding: "10px", borderRadius: "5px", justifyContent: 'center' }}>
                                <small style={{ color: "#767676" }}>ยังไม่มีภาพ</small>
                            </Space>
                        }
                    </>
                )
            }
        },
        {
            title: "Upload",
            dataIndex: "upload",
            key: "upload",
            className: 'drag-visible drag-title-size',
            width: "20%",
            render: (_, record, index) => {
                return (
                    <>
                        <Col style={{ marginBottom: "10px" }}>
                            <Upload customRequest={(file) => onUploadBanner(file, index, 'mobile')} onRemove={() => onRemoveBanner(index)} accept="image/*">
                                <Button size="small" type="success">อัพโหลดภาพ</Button>
                            </Upload>
                            <small>Ratio 1:2 (800 x 400 px)</small>
                        </Col>
                        <Col>
                            <Upload customRequest={(file) => onUploadBanner(file, index, 'desktop')} onRemove={() => onRemoveBanner(index)} accept="image/*">
                                <Button size="small" type="success">อัพโหลดภาพ</Button>
                            </Upload>
                            <small>Ratio 1:3 (1200 x 400 px)</small>
                        </Col>
                    </>
                )
            }
        },
        {
            title: "URL to (ลิงก์ภายนอก)",
            key: "url",
            dataIndex: "url",
            width: "20%",
            render: (_, record, index) => {
                return (
                    <>
                        <Input pattern="https?://.+" defaultValue={record?.url} onChange={(e) => debounced(e, index)} />
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
            data.contentData.filter((value) => value?.ads_banner_id !== undefined).map((item, index) => {
                tempData.push({
                    ads_banner_id: item.ads_banner_id,
                    image_id: item.image_id,
                    image_id_desktop: item.image_id_desktop,
                    url: item.url,
                    order_no: index + 1,
                    create_by: 6003,
                    update_by: 6003
                })
            })

            const updateData = await editContentAdsBanner(tempData)

            if (updateData.ResponseCode === 200) {
                notification.success({
                    message: 'Save content ads banner successful'
                });
                fetchContentListData()
                setDisableSaveBtn(true)
            }

        } catch (error) {
            notification.error({
                message: 'Failed save content ads banner'
            });
        }
    }

    const debounced = useDebouncedCallback(
        (e, index) => {
            let inputUrl = decodeURI(e?.target?.value)
            contentData[index].url = inputUrl
            setContentData([...contentData])
            setDisableSaveBtn(false)
        },
        1000
    )

    const onUploadBanner = (file, index, device) => {
        setDisableSaveBtn(false)
        let API_URL = `${process.env.REACT_APP_PATOIS_MICROSERVICE_API_URI}/api/shop/content/upload/image`
        if (file.file) {
            if (file.file.size > 10000000) {
                message.error('Max file size 10MB');
            } else {
                const body = new FormData();
                body.append("files[]", file.file, file.file.name);
                fetch(`${API_URL}`, {
                    method: "post",
                    body: body,
                })
                    .then((res) => res.json())
                    .then((res) => {
                        if (device === 'mobile') {
                            contentData[index].image_id = res?.data.imagesId
                            contentData[index].image_url = res?.data?.description
                            setContentData([...contentData])
                        } else {
                            contentData[index].image_id_desktop = res?.data.imagesId
                            contentData[index].image_desktop_url = res?.data?.description
                            setContentData([...contentData])
                        }
                    })
                    .catch((err) => {
                        message.error(err);
                    });
            }

        }
    }

    const onRemoveBanner = (index) => {

    }

    return (
        <>
            <div className="tabled">
                <Col>
                    <Card
                        bordered={false}
                        className="criclebox tablespace mb-24"
                        title="Ads Banner"
                    >
                        <div className="table-responsive">
                            <Form onFinish={onSave} form={form}>
                                <Form.Item name="contentData">
                                    <Table
                                        columns={columns}
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

export default ConfigAdsBanner;

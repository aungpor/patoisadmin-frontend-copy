import {
    Row,
    Col,
    Card,
    Descriptions,
    Select,
    Modal,
    Radio,
    Table,
    Form,
    Input,
    Space,
    DatePicker,
    Upload,
    message,
    notification
} from "antd";
import Button from "antd-button-color"
import { UploadOutlined, CloudUploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect, useState, useRef, useCallback } from "react";
import { getAllCatagory, getAllTag, getSubCatagory, createContent, addTag } from "../../services/content.service";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ReactTags from 'react-tag-autocomplete'
import 'antd/dist/antd.css';
import 'antd-button-color/dist/css/style.css';

import './style.scss'

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Dragger } = Upload;
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

function CreateContentForm(props) {
    const [campaignId, setCamapaignId] = useState(props.campaignId);
    const [titleName, setTitleName] = useState(props.titleName);
    const [formType, setFormType] = useState(props.type);
    const [optionAllCatagory, setOptionAllCatagory] = useState([])
    const [optionSubCatagory, setOptionSubCatagory] = useState([])
    const [promotionTypedata, setPromotionTpyeData] = useState([]);
    const [tags, setTags] = useState([])
    const [suggestions, setSuggestions] = useState([])
    const [selectCatagory, setSelectCatagory] = useState()
    const [selectSubCatagory, setSelectSubCatagory] = useState()
    const [uploadMobileCoverId, setUploadMobileCoverId] = useState()
    const [uploadDesktopCoverId, setUploadDesktopCoverId] = useState()
    const [contentsDetail, setContentsDetail] = useState('')
    const [altMobileCover, setAltMobileCover] = useState('')
    const [altDesktopCover, setAltDesktopCover] = useState('')
    const [inputTags, setInputTags] = useState([])
    const [formDraft, setFormDraft] = useState({})
    const [isLoadingDraft, setIsLoadingDraft] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const reactTags = useRef()
    const editor = useRef(null);
    const [form] = Form.useForm();

    const fetchAllCatagory = async () => {
        const data = await getAllCatagory()
        const optionArr = data.map((item) => {
            return {
                value: item.content_category_id,
                label: item.category_name
            }
        })
        setOptionAllCatagory(optionArr)
    }

    const fetchSubCatagory = async (catagoryId) => {
        const data = await getSubCatagory(catagoryId)
        const optionArr = data.map((item) => {
            return {
                value: item.content_sub_category_id,
                label: item.sub_category_name
            }
        })
        setOptionSubCatagory(optionArr)
    }

    const fetchAllTag = async () => {
        const data = await getAllTag()
        const setTagSuggestion = data.map((item) => {
            return {
                id: item.tag_id,
                name: item.tag_name
            }
        })
        setSuggestions(setTagSuggestion)
    }

    const onDelete = useCallback((tagIndex) => {
        setTags(tags.filter((_, i) => i !== tagIndex))
        setInputTags(inputTags.filter((_, i) => i !== tagIndex))
    }, [tags])

    const onAddition = useCallback((newTag) => {
        setTags([...tags, newTag])
        setInputTags([...inputTags, newTag])
    }, [tags])

    const onFinish = async (values) => {
        try {
            setIsLoading(true)
            const tagArray = []
            for(const tag of inputTags){
                if(tag.id){
                    tagArray.push(tag.id)
                }
                else{
                    const data = {
                        tag_name: tag.name
                    }
                    const newTag = await addTag(data)
                    const newTagId = newTag.contentTagId
                    tagArray.push(newTagId)
                }
            }
            const tempData = { ...values }
            tempData.images_id = uploadMobileCoverId
            tempData.images_id_desktop = uploadDesktopCoverId
            tempData.start_date = moment(tempData.start_date).format('MM/DD/YYYY')
            tempData.end_date = moment(tempData.start_date).format('MM/DD/YYYY')
            tempData.content_detail = contentsDetail
            tempData.tag_id = tagArray
            tempData.show_writer_name = "Admin"
            tempData.active = 1
            tempData.create_by = 1234
            tempData.update_by = 1234
            tempData.order_no = 1
            tempData.approve = 1
            tempData.status = "save"
            console.log(tempData)
            const createContentRes = await createContent(tempData)
            if (createContentRes.ResponseCode === 200) {
                notification.success({
                    message: 'Create content successful'
                });
                setTimeout(() => {
                    window.location.reload(true)
                }, 3000)

            }
        } catch (error) {
            setIsLoading(false)
            notification.error({
                message: 'Create content failed'
            });
        }
    }

    const saveDraft = async () => {
        try {
            setIsLoadingDraft(true)
            const tagArray = []
            for(const tag of inputTags){
                if(tag.id){
                    tagArray.push(tag.id)
                }
                else{
                    const data = {
                        tag_name: tag.name
                    }
                    const newTag = await addTag(data)
                    const newTagId = newTag.contentTagId
                    tagArray.push(newTagId)
                }
            }
            const tempData = { ...formDraft }
            tempData.images_id = uploadMobileCoverId
            tempData.images_id_desktop = uploadDesktopCoverId
            tempData.content_detail = contentsDetail
            tempData.tag_id = tagArray
            tempData.show_writer_name = "Admin"
            tempData.active = 1
            tempData.create_by = 1234
            tempData.update_by = 1234
            tempData.order_no = 1
            tempData.approve = 1
            tempData.status = "draft"
            console.log(tempData)
            const createContentRes = await createContent(tempData)
            if (createContentRes.ResponseCode === 200) {
                notification.success({
                    message: 'Create content draft successful'
                });
                setTimeout(() => {
                    window.open('/content-drft-list')
                }, 3000)
            }
        } catch (error) {
            setIsLoadingDraft(false)
            notification.error({
                message: 'Create content failed'
            });
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        fetchAllCatagory()
        fetchAllTag()
    }, [])

    const onUploadMobileCover = (file) => {
        let API_URL = `${process.env.REACT_APP_PATOIS_MICROSERVICE_API_URI}/api/shop/content/upload/image`
        if (file.file) {
            console.log(file.status);
            if (file.file.size > 10000000) {
                message.error('Max file size 10MB');
            } else {
                const body = new FormData();
                body.append("files[]", file.file, file.file.name);
                body.append("alt", altMobileCover);
                fetch(`${API_URL}`, {
                    method: "post",
                    body: body,
                })
                    .then((res) => res.json())
                    .then((res) => {
                        setFormDraft({...formDraft, image_url: res?.data?.description})
                        setUploadMobileCoverId(res?.data.imagesId)
                    })
                    .catch((err) => {

                    });
            }

        }
    }

    const onUploadDesktopCover = (file) => {
        let API_URL = `${process.env.REACT_APP_PATOIS_MICROSERVICE_API_URI}/api/shop/content/upload/image`
        if (file.file) {
            console.log(file.status);
            if (file.file.size > 10000000) {
                message.error('Max file size 10MB');
            } else {
                const body = new FormData();
                body.append("files[]", file.file, file.file.name);
                body.append("alt", altDesktopCover);
                fetch(`${API_URL}`, {
                    method: "post",
                    body: body,
                })
                    .then((res) => res.json())
                    .then((res) => {
                        setFormDraft({...formDraft , image_desktop_url: res?.data?.description})
                        setUploadDesktopCoverId(res?.data.imagesId)
                    })
                    .catch((err) => {

                    });
            }

        }
    }

    const uploadAdapter = (loader) => {
        let API_URL = `${process.env.REACT_APP_PATOIS_MICROSERVICE_API_URI}/api/shop/content/upload/image`
        return {
            upload: () => {
                return new Promise((resolve, reject) => {
                    try {
                        const body = new FormData();
                        loader.file.then((file) => {
                            body.append("files[]", file, file.name);
                            // let headers = new Headers();
                            // headers.append("Origin", "http://localhost:3000");
                            fetch(`${API_URL}`, {
                                method: "post",
                                body: body,
                                headers: {
                                    Accept: 'application/json',
                                    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4NzU3OCIsImVtYWlsIjoiIiwidGVsIjoiMDgyODE0MTQ2OSIsIm5hbWUiOiJQZVRjSDQiLCJncm91cHNpZCI6MiwiaXNCaW5kTWF4Y2FyZCI6ZmFsc2UsInBhdG9pc01heGNhcmRJZCI6bnVsbCwibGluZUlkIjpudWxsLCJpYXQiOjE2ODYxMzA4MzUsImV4cCI6MTY4ODcyMjgzNX0.LiHbuEEmyZ5Oc2CCO4HXbqg7X5GFFwIbP-vJk-FMRUI'
                                },
                            })
                                .then((res) => res.json())
                                .then((res) => {
                                    resolve({
                                        default: res?.data?.description
                                    });
                                })
                                .catch((err) => {
                                    reject(err);
                                });
                        });
                    } catch (error) {

                    }
                });
            }
        };
    }

    const onSelectCatagory = (value, label) => {
        setSelectSubCatagory(null)
        setSelectCatagory(label)
        setFormDraft({ ...formDraft, category_id: value })
        fetchSubCatagory(value)
    }

    const onSelectSubCatagory = (value, label) => {
        setSelectSubCatagory(value)
        setFormDraft({ ...formDraft, content_sub_category_id: value })
    }

    const onRemoveMobileCover = () => {
        setFormDraft({...formDraft, image_url: null})
        setUploadMobileCoverId(null)
    }

    const onRemoveDesktopCover = () => {
        setFormDraft({...formDraft, image_desktop_url: null})
        setUploadDesktopCoverId(null)
    }

    function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        };
    }
    
    return (
        <>
            <Row>
                <Col xs={24} className="mb-24">
                    <Card
                        className="header-solid h-full ant-card-p-0"
                        title={
                            <>
                                <Row

                                    className="ant-row-flex ant-row-flex-middle"
                                >
                                    <Col xs={24} md={12}>
                                        <h6 className="font-semibold m-0">{titleName}</h6>
                                    </Col>

                                </Row>
                            </>

                        }
                    >
                        <Form
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            form={form}
                            scrollToFirstError={true}
                            layout="vertical"
                        >
                            <Col span={24} md={12}>
                                <Form.Item style={{ marginBottom: "5px" }}
                                    name="content_name"
                                    label='Content Name'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required',
                                        },
                                    ]}>
                                    <Input
                                        style={{ width: "100%" }}
                                        onChange={e => setFormDraft({ ...formDraft, content_name: e.target.value })}
                                    />
                                </Form.Item>
                                <Form.Item style={{ marginBottom: "5px" }}
                                    name="category"
                                    label='Category'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required',
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Select Category"
                                        size={"large"}
                                        value={selectCatagory}
                                        onChange={onSelectCatagory}
                                        style={{ width: "100%" }}
                                        options={optionAllCatagory}
                                    >
                                    </Select>
                                </Form.Item>
                                <Form.Item style={{ marginBottom: "5px" }}
                                    name="content_sub_category_id"
                                    label='Sub Category'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required',
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Select Sub Category"
                                        size={"large"}
                                        value={selectSubCatagory}
                                        onChange={onSelectSubCatagory}
                                        disabled={selectCatagory ? false : true}
                                        style={{ width: "100%" }}
                                    >
                                        {
                                            optionSubCatagory.map((item, index) =>

                                                <Option key={index} value={item.value}>{item.label}</Option>
                                            )
                                        }

                                    </Select>
                                </Form.Item>
                                <Form.Item style={{ marginBottom: "10px" }}
                                    name="images_id"
                                    label='Mobile Cover'
                                >
                                    <Input
                                        placeholder="Alt image"
                                        onChange={(e) => setAltMobileCover(e.target.value)}
                                        style={{ width: "100%" }}
                                    />
                                    <Space style={{ background: "#f2f2f3", width: "100%", padding: "10px" }}>
                                        <Upload customRequest={onUploadMobileCover} onRemove={onRemoveMobileCover} accept="image/*">
                                            <Button style={{ paddingRight: "50px", paddingLeft: "50px", marginRight: "50px" }} icon={<CloudUploadOutlined />}>Upload File</Button>
                                            Max file size 10MB.
                                        </Upload>
                                    </Space>
                                    <small>Ratio 1:2 (ขนาด 800 x 400 px)</small>
                                </Form.Item>
                                <Space style={{ background: "#f2f2f3", width: "100%", padding: "10px" }}>
                                    <img src={formDraft?.image_url} alt="" />
                                </Space>
                                <Form.Item style={{ marginBottom: "10px" }}
                                    name="desktop_cover_image"
                                    label='Desktop Cover'
                                >
                                    <Input
                                        placeholder="Alt image"
                                        onChange={(e) => setAltDesktopCover(e.target.value)}
                                        style={{ width: "100%" }}
                                    />
                                    <Space style={{ background: "#f2f2f3", width: "100%", padding: "10px" }}>
                                        <Upload
                                            customRequest={onUploadDesktopCover} onRemove={onRemoveDesktopCover} accept="image/*">
                                            <Button style={{ paddingRight: "50px", paddingLeft: "50px", marginRight: "50px" }} icon={<CloudUploadOutlined />}>Upload File</Button>
                                            Max file size 10MB.
                                        </Upload>
                                    </Space>
                                    <small>Ratio 1:3 (ขนาด 1200 x 400 px)</small>
                                    <Space style={{ background: "#f2f2f3", width: "100%", padding: "10px" }}>
                                        <img src={formDraft?.image_desktop_url} alt="" />
                                    </Space>
                                </Form.Item>
                                <Form.Item style={{ marginBottom: "5px" }}
                                    name="short_desc"
                                    label='Short Description'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required',
                                        },
                                    ]}>
                                    <Input
                                        onChange={e => setFormDraft({ ...formDraft, short_desc: e.target.value })}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                                <Form.Item style={{ marginBottom: "5px" }}
                                    name="short_quote"
                                    label='Short Quote'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required',
                                        },
                                    ]}>
                                    <Input
                                        onChange={e => setFormDraft({ ...formDraft, short_quote: e.target.value })}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                                <Form.Item style={{ marginBottom: "5px" }}
                                    name="content_detail"
                                    label='Content Details'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required',
                                        },
                                    ]}>
                                    <CKEditor
                                        editor={Editor}
                                        config={{
                                            extraPlugins: [uploadPlugin],
                                        }}
                                        data="<p>Hello from CKEditor 5!</p>"
                                        onReady={editor => {
                                            // You can store the "editor" and use when it is needed.
                                            console.log('Editor is ready to use!', editor);
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setContentsDetail(data)
                                            console.log({ event, editor, data });
                                        }}
                                        onBlur={(event, editor) => {
                                            console.log('Blur.', editor);
                                        }}
                                        onFocus={(event, editor) => {
                                            console.log('Focus.', editor);
                                        }}
                                    />
                                </Form.Item>
                                <Row>
                                    <Col md={12}>
                                        <Form.Item style={{ marginBottom: "5px", margin: "5px" }}
                                            name="start_date"
                                            label='Started Date'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'This field is required',
                                                },
                                            ]}>
                                            < DatePicker
                                                placeholder="Start Date"
                                                onChange={(date) => setFormDraft({ ...formDraft, start_date: moment(date).format('MM/DD/YYYY') })}
                                                // defaultValue={[moment('2015/01/01', 'YYYY/MM/DD'), moment('2015/01/01', 'YYYY/MM/DD')]}
                                                size={"large"}
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Item style={{ marginBottom: "5px", margin: "5px" }}
                                            name="end_date"
                                            label='Ended Date'
                                        >
                                            < DatePicker
                                                placeholder="Ended Date"
                                                onChange={(date) => setFormDraft({ ...formDraft, end_date: moment(date).format('MM/DD/YYYY') })}
                                                // defaultValue={[moment('2015/01/01', 'YYYY/MM/DD'), moment('2015/01/01', 'YYYY/MM/DD')]}
                                                size={"large"}
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item style={{ marginBottom: "5px" }}
                                    name="sponsored"
                                    label='Sponsored'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'This field is required',
                                        },
                                    ]}
                                >
                                    <Radio.Group buttonStyle="solid" onChange={e => setFormDraft({ ...formDraft, sponsored: e.target.value })}>
                                        <Radio style={{ margin: "10px" }} value="1">Yes</Radio>
                                        <Radio style={{ margin: "10px" }} value="0">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item style={{ marginBottom: "5px" }}
                                    name="tag_id"
                                    label='Tags'>
                                    <ReactTags
                                        ref={reactTags}
                                        tags={tags}
                                        suggestions={suggestions}
                                        onDelete={onDelete}
                                        onAddition={onAddition}
                                        allowNew
                                    />
                                </Form.Item>
                                <Form.Item style={{ marginBottom: "5px" }}
                                    name="review_url"
                                    label='Review URL'
                                >
                                    <Input
                                        onChange={e => setFormDraft({ ...formDraft, review_url: e.target.value })}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>

                        </Form>
                        <Form.Item>
                            <Button disabled={Object.keys(formDraft).length === 0 || isLoadingDraft || isLoading} size={"large"} type="warning" style={{ paddingRight: "30px", paddingLeft: "30px", marginTop: "10px" }} htmlType="button" loading={isLoadingDraft} onClick={saveDraft}>Save Draft</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button disabled={Object.keys(formDraft).length === 0 || isLoading || isLoadingDraft} size={"large"} type="success" style={{ paddingRight: "30px", paddingLeft: "30px", marginTop: "10px" }} htmlType="submit" loading={isLoading} onClick={() => form.submit()}>Create</Button>
                        </Form.Item>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default CreateContentForm;

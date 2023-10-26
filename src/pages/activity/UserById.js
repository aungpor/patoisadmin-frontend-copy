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
} from "antd";
import { useParams } from "react-router-dom";

import InquiryUserTable from "../../components/Activity/InquiryUserTable";
import { useEffect, useState } from "react";

const { Search } = Input;

function UserByIdPage() {
    let params = useParams();

    const [userId, setUserId] = useState()

    useEffect(() => {
        if (params?.id) setUserId(params?.id)
    }, [params])

    return (
        <>
            <Search
                placeholder="input search text"
                enterButton="Search"
                onSearch={(event) => {
                    
                }}
                style={{
                    width: "100%",
                }}
            />
            <InquiryUserTable userId={userId} />
        </>
    )
}

export default UserByIdPage;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Row,
    Col,
} from "antd";

import EditContentForm from "../../components/form/EditContentForm";

function EditContent() {

    const params = useParams()

    return (
        <>
            <Row>
                <Col xs={24} md={24}>
                    <EditContentForm
                        id={params.id}
                        titleName={"Content Detail"}
                        campaignId={""}
                        status={params.status}
                    />
                </Col>
            </Row>
        </>
    )
}

export default EditContent;
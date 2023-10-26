import { useEffect, useState } from "react";
import {
    Row,
    Col,
} from "antd";

import CreateContentForm from "../../components/form/CreateContentForm";

function CreateContent() {

    return (
        <>
            <Row>
                <Col xs={24} md={24}>
                    <CreateContentForm
                        titleName={"Create Content"}
                        campaignId={""}
                        type={"create"}
                    />
                </Col>
            </Row>
        </>
    )
}

export default CreateContent;
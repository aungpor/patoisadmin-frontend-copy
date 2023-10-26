import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getManualUserProviderService } from "../../services/user.service";
import {
    Row,
    Col,
    Card,
    Radio,
    Table,
    Button

} from "antd";

const columns = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
        // width: "32%",
    },
    {
        title: "Name",
        dataIndex: "name",
        // key: "name",
    },
    {
        title: "Referral Code",
        dataIndex: "user_code",
        // key: "user_code",
    },
    {
        title: "Active",
        dataIndex: "active",
        // key: "active",
    },
    {
        key: "action",
        title: "Action",
        dataIndex: "action",
        render: (__, record) => {
            return (
                <Button
                >
                    <Link to={`referral-user/${record.id}`}>
                        View
                    </Link>
                </Button>
            )
        },
    }

];

function ReferralUser() {
    const [users, setUsers] = useState([]);

    const getUserManualProvider = async () => {
        let userArray = [];
        userArray = await getManualUserProviderService();

        userArray = userArray.map(user => {
            return {
                ...user,
                key: user.id,
                active: user.active == "1" ? "Active": "Inactive"
            }
        })

        // var hasDuplicate = false;
        // userArray.map(v => v.id).sort().sort((a, b) => {
        //     if (a === b) hasDuplicate = true
        // })
        // console.log("hasDuplicate: ", hasDuplicate);

        setUsers(userArray);
    }

    useEffect(() => {
        getUserManualProvider();
    }, [])

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                    
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Referral User"
                        >
                            <Col span={12} offset={20}>
                                <a href="/create-referral-user"><Button className="ant-btn ant-btn-primary">Create Referral User</Button></a>
                            </Col>
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={users}
                                    pagination={false}
                                    className="ant-border-space"
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default ReferralUser;
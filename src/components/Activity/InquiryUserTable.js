import {
    Select,
    Table,
    Input,
    Switch,
    notification,
    Tabs
} from "antd";
import UserTableReview from "./UserTableReview";
import UserTablePoints from "./UserTablePoints";

import './style.scss'
const { Search } = Input;

function InquiryUserTable(props) {

    const items = [
        {
            key: '1',
            label: 'Review History',
            children: <UserTableReview {...props} />,
        },
        {
            key: '2',
            label: 'Points History',
            children: <UserTablePoints {...props} />,
        }
    ];

    return (
        <div className="InquiryUserTable-main">
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    )
}

export default InquiryUserTable;
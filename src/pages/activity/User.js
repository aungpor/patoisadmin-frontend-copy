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

const { Search } = Input;

function UserPage() {

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
        </>
    )
}

export default UserPage;
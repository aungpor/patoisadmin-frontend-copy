import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  DatePicker,
  Spin

} from "antd";
import { PlusOutlined, ExclamationOutlined, ExclamationCircleOutlined, SearchOutlined, LoadingOutlined } from "@ant-design/icons";

import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getShopByShopTypesService, shopExportExcel } from "../../services/shop.service";
import moment from 'moment';
import Button from "antd-button-color"
import 'antd/dist/antd.css';
import 'antd-button-color/dist/css/style.css';

const { RangePicker } = DatePicker;

function ShopApproval() {
  const [shopData, setShopData] = useState([]);
  const [shopStatus, setShopStatus] = useState("1")
  const [loading, setLoading] = useState(false);
  const onChange = (e) => {
    setShopData([])
    console.log(`radio checked:${e.target.value}`);
    getShop(e.target.value);
  }

  const getShop = async (shopStatusCode) => {
    const shopArray = [];
    const data = await getShopByShopTypesService(shopStatusCode);
    if (data) {
      const shops = data;
      for (const [i, shop] of shops.entries()) {
        const shopObject = await setShopObjectData(shop, i);
        shopArray.push(shopObject);
      }
    }
    setShopData(shopArray);
  }

  const setShopObjectData = async (shop, index) => {
    return {
      key: shop.shop_id,
      index: index + 1,
      shop_id: (
        <>
          <div className="avatar-info">
            <p>{shop.shop_id}</p>
          </div>
        </>
      ),
      shopName: (
        <>
          <div className="author-info">
            <p>{shop.shopName}</p>
          </div >
        </>
      ),

      date: moment(shop.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
      user: (
        <>
          <div className="ant-employed">
            <span>{shop.user_id}</span>
          </div>
        </>
      ),
      action: (
        <>
          <div className="ant-employed">
            <Link to={`shop/${shop.shop_id}`} target="_blank">
              View
            </Link>
          </div>
        </>
      ),
    }
  }

  const getColumnTimeProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <DatePicker.RangePicker
          onChange={e => {
            setSelectedKeys(e?.length ? [e] : [])
          }}
          placeholder={["Start", "End"]}
          value={selectedKeys[0]}
          format="YYYY-MM-DD"
        />
        <Button
          type="primary"
          role="search"
          onClick={() => {
            handleTimeRangeSearch(selectedKeys, confirm, dataIndex)
          }}
          style={{ width: 90, marginRight: 8 }}
          icon={<SearchOutlined />}
          size="small"
        >
          Search
        </Button>
        <Button
          role="reset"
          style={{ width: 90 }}
          onClick={() => handleTimeRangeReset(clearFilters)}
          size="small"
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      // console.log("moment: ", moment(record[dataIndex]).format("YYYY-MM-DD"));
      // console.log("value[0]: ", moment(value[0]).format("YYYY-MM-DD"));
      // console.log("value[1]: ", moment(value[1]).format("YYYY-MM-DD"));
      return record[dataIndex] ? moment(moment(record[dataIndex]).format("YYYY-MM-DD")).isBetween(moment(moment(value[0]).format("YYYY-MM-DD")), moment(moment(value[1]).format("YYYY-MM-DD")), null, '[]') : ""
    },
    render: text => text
  });


  const handleTimeRangeSearch = (selectedKeys, confirm, dataIndex) => {

    confirm();
  };

  const handleTimeRangeReset = clearFilters => {
    clearFilters();
  };

  const columns = [
    {
      title: 'No.',
      key: 'index',
      dataIndex: "index",

      width: "5%"
    },
    {
      title: "Shop ID",
      dataIndex: "shop_id",
      key: "shop_id",
    },
    {
      title: "Shop Name",
      dataIndex: "shopName",
      key: "shopName",
    },

    {
      title: "Created Date",
      key: "date",
      dataIndex: "date",
      ...getColumnTimeProps("date"),
      width: "5%"
      // filteredValue: filteredInfo.date || null,

    },
    {
      title: "User",
      key: "user",
      dataIndex: "user",
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
    },

  ];

  const columnExcel = [
    {
      title: "Shop ID",
      dataIndex: "shop_id",
      key: "shop_id",
    },
    {
      title: "Shop Name",
      dataIndex: "shopName",
      key: "shopName",
    },
    {
      title: "Created Date",
      key: "create_date",
      dataIndex: "create_date",
      ...getColumnTimeProps("create_date")
    },
    {
      title: "Update Date",
      key: "update_date",
      dataIndex: "update_date",
      ...getColumnTimeProps("update_date")
    },
    // {
    //   title: "Latitude",
    //   dataIndex: "latitude",
    //   key: "latitude",
    // },
    // {
    //   title: "Longitude",
    //   dataIndex: "longitude",
    //   key: "longitude",
    // },
    {
      title: "Latitude & Longitude",
      dataIndex: "latitude_longitude",
      key: "latitude_longitude",
    }

  ];

  const handleClick = async () => {
    if (shopStatus == "1") {
      setLoading(true)
      await shopExportExcel(1)
      setLoading(false)
    }
    if (shopStatus == "2") {
      setLoading(true)
      await shopExportExcel(2)
      setLoading(false)
    }
    if (shopStatus == "3") {
      setLoading(true)
      await shopExportExcel(3)
      setLoading(false)
    }

  };


  const onClickStatus = (status) => {
    console.log(status);
    setShopStatus(status)
  }

  useEffect(() => {
    getShop(1);
  }, []);

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Shop Approval"
              extra={
                <>

                  <Radio.Group onChange={onChange} defaultValue="1">
                    <Radio.Button value="1" onClick={() => onClickStatus("1")}>New Shop</Radio.Button>
                    <Radio.Button value="2" onClick={() => onClickStatus("2")}>Approved</Radio.Button>
                    {/* <Radio.Button value="4">Dupicated</Radio.Button> */}
                    <Radio.Button value="3" onClick={() => onClickStatus("3")}>Rejected</Radio.Button>
                  </Radio.Group>
                  <Button onClick={handleClick} type="success" style={{ background: "rgb(96, 184, 88)", borderRadius: "10px", marginLeft: "10px" }}><Spin spinning={loading} indicator={<LoadingOutlined style={{fontSize: 24, color: "white", marginRight:"7px"}}/>}></Spin> Export Excel</Button>
                  
                </>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={shopData}
                  className="ant-border-space"
                  pagination={{
                    position: ['topRight', 'bottomRight'],
                    // pageSize: 20
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ShopApproval;

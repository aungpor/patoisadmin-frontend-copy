// //"react-export-excel": "^0.5.3",
// import React, { useState } from "react";
// import ReactExport from "react-export-excel";
// import {
//     Row,
//     Col,
//     Card,
//     Button,
//     Descriptions,
//     Select,
//     Modal,
//     Radio,
//     Table,
//     Input,
//     Form,
//     Space,
//     Image,
//     AutoComplete,
//     DatePicker
// } from "antd";
// import { CloudDownloadOutlined } from "@ant-design/icons";
// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;




// export function ExcelDownload(props) {
//     const [column, setColumn] = useState(props.colunm);
//     const [data, setData] = useState(props.data);
//     const dataSet1 = [
//         {
//             name: "Johson",
//             amount: 30000,
//             sex: 'M',
//             is_married: true
//         },
//         {
//             name: "Monika",
//             amount: 355000,
//             sex: 'F',
//             is_married: false
//         },
//         {
//             name: "John",
//             amount: 250000,
//             sex: 'M',
//             is_married: false
//         },
//         {
//             name: "Josef",
//             amount: 450500,
//             sex: 'M',
//             is_married: true
//         }
//     ];

//     return (
//         <>
//             <ExcelFile element={<Button><CloudDownloadOutlined />Download</Button>}>
//                 <ExcelSheet data={data} name="Sheet1">
//                     <ExcelColumn label="Date" value="date" />
//                     <ExcelColumn label="All Shop" value="all_shop" />
//                     <ExcelColumn label="Non Approved Shop" value="non_approved_shop" />
//                     <ExcelColumn label="Approved Shop" value="approved_shop" />
//                     <ExcelColumn label="Rejected Shop" value="rejected_shop" />
//                     <ExcelColumn label="Merged Shop" value="merged_shop" />
//                     <ExcelColumn label="Status" value="status" />
//                 </ExcelSheet>
//             </ExcelFile>
//         </>
//     );
// }


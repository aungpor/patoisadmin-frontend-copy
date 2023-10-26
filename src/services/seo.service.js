import axios from "axios";

const patois_admin_url = process.env.REACT_APP_PATOIS_ADMIN_API_URI;
const patois_url = process.env.REACT_APP_PATOIS_API_URI;

export const getListShopKeyword = async (tableParam) => {
    return await axios.get(patois_url + `/api/shop/seo/getListShopKeyword?pageNumber=${tableParam.pagination.current}&rowsOfPage=${tableParam.pagination.pageSize}`).then(res => {
        console.log("getListShopKeyword res", res);
        return res.data;
    }).catch((err) => {
        catchError(err, null, "getListShopKeyword");
        return {};
    });
}

export const editShopKeyword = async (data) => {
    return await axios.put(patois_url + `/api/shop/seo/ediShopKeyword/${data.shop_id}`, data).then(res => {
        console.log("editShopKeyword res", res);
        return res.data;
    }).catch((err) => {
        catchError(err, null, "editShopKeyword");
        return {};
    });
}

function catchError(error, path, func) {
    try {

        return;
    } catch (err) {
        console.error("Response catchError : ", error);
        console.log(err);
        return;
    }

}
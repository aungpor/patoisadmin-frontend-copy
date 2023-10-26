import axios from "axios";
import { maxCardService } from '../services/maxCard.service';
import CryptoJS from 'crypto-js';
import moment from "moment";
import { sendNotificationService } from "./notification.service";
import { getCurrentPointService } from "./campaign-point";
import { checkToken } from './role.service'

const patois_admin_url = process.env.REACT_APP_PATOIS_ADMIN_API_URI;
const patois_url = process.env.REACT_APP_PATOIS_API_URI;
const patois_content_url = process.env.REACT_APP_PATOIS_CONTENT_API_URI;
// const patois_url = "https://uat-patois-api-asv.azurewebsites.net";

export const getShopByShopTypesService = async (shopType = 1) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + '/shop/status/' + shopType, { headers }).then(res => {
        console.log("getShopByShopTypesService res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getShopType");
        return [];
    });
}

export const getShopByShopIdService = async (shopId) => {
    return await axios.get(patois_url + '/api/shop/allaction/' + shopId).then(res => {
        console.log("getShopByShopIdService res", res);
        return res.data.data[0];
    }).catch((err) => {
        catchError(err, null, "getShopByShopIdService");
        return {};
    });
}

export const updateStatusCodeShop = async (shop, shop_status_code) => {
    let getCurrentPoint = await getCurrentPointService(shop.shop_id, "create_shop");
    // console.log("getCurrentPoint: ", getCurrentPoint);
    let productQaun = parseInt(getCurrentPoint.point);
    let promosCode = getCurrentPoint.campaign_point_id;
    // let productQaun = 30;
    // console.log("productQaun: ", productQaun, typeof (productQaun));
    // console.log("promosCode: ", promosCode);

    let data = {
        shop_id: shop.shop_id,
        shop_status_code: shop_status_code
    }

    let notificationData = {
        user_id: null,
        withs: shop.user_id,
        vTitle: shop_status_code == "2" ? "การรีวิวร้านอาหารของคุณได้รับการอนุมัติ" : "ข้อมูลร้านอาหารยังไม่สมบูรณ์",
        vDescription: shop_status_code == "2" ? `คุณได้รับ ${productQaun} Max points จากการรีวิวร้านอาหาร คุณสามารถใช้คะแนนได้ในวันถัดไป` : `ข้อมูลบางอย่างของรีวิวและร้านอาหาร ${shop.shopName} ยังไม่สมบูรณ์`,
        vTypes: "report_approve_shop",
        ref_id: shop.shop_id
    }

    // let isCampaignDate = false;
    // isCampaignDate = checkCampaignDate(shop.created_at);
    // // console.log("isCampaignDate: ", isCampaignDate);
    // if (isCampaignDate) {
    //     notificationData = {
    //         user_id: null,
    //         withs: shop.user_id,
    //         vTitle: shop_status_code == "2" ? "การรีวิวร้านอาหารของคุณได้รับการอนุมัติ" : "ข้อมูลร้านอาหารยังไม่สมบูรณ์",
    //         vDescription: shop_status_code == "2" ? "คุณได้รับ 60 Max points จากการรีวิวร้านอาหาร คุณสามารถใช้คะแนนได้ในวันถัดไป" : `ข้อมูลบางอย่างของรีวิวและร้านอาหาร ${shop.shopName} ยังไม่สมบูรณ์`,
    //         vTypes: "report_approve_shop",
    //         ref_id: shop.shop_id
    //     }
    //     productQaun = 60;
    // }

    if (data.shop_status_code == '2') {
        // console.log("shop_status_code == '2'");
        await maxCardService.handleSendMaxpoint(shop, productQaun, promosCode);
    }

    await sendNotificationService(notificationData.vTitle, notificationData.vDescription, notificationData.withs, notificationData.vTypes, notificationData.ref_id)

    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.put(patois_admin_url + '/shop/', data, { headers }).then(res => {
        console.log("res", res);
        return res
    }).catch((err) => catchError(err, null, "getShopType"));
}

export const getNearbyShopSerivce = async (lat, lng) => {
    return await axios.get(patois_url + `/api/activity/shopsNearby?lat=${lat}&lng=${lng}&pageNumber=1&rowsOfPage=30`).then(res => {
        console.log("getNearbyShopSerivce res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "getShopByShopIdService");
        return [];
    });
}

export const mergeShopService = async (from_shop, to_shop) => {
    let data = {
        from_shop: from_shop,
        to_shop: to_shop
    }
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.put(patois_admin_url + '/shop/merge-shop', data, { headers }).then(res => {
        console.log("mergeShopService res", res);
        return res
    }).catch((err) => catchError(err, null, "getShopType"));
}

export const addNotification = async (request) => {

}

const checkCampaignDate = (date) => {
    // console.log("date: ", moment(date).format("YYYY-MM-DD"));
    return moment(moment(date).format("YYYY-MM-DD")).isBetween('2022-12-05', '2023-01-05', null, '[]')
}

export const getShopReportService = async (start_date, end_date) => {
    let data = {
        start_date: start_date,
        end_date: end_date
    }
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.post(patois_admin_url + '/shop/report/shop-approval', data, { headers }).then(res => {
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getShopByShopIdService");
        return [];
    });
}

export const getShopWithLocationByStatus = async (shopStatus) => {
    return await axios.get(patois_admin_url + `/shop/getShopWithLocationByStatus/${shopStatus}`).then(res => {
        console.log("getShopWithLocationByStatus res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getShopWithLocationByStatus");
        return [];
    });
}

export const updateReviewStatus = async (postReviewId, active) => {
    let data = {
        postReviewId,
        active
    }

    return await axios.post(patois_content_url + '/api/shop/admin/updateReviewStatus', data).then(res => {
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getShopByShopIdService");
        return [];
    });
}

export const shopExportExcel = async (shopStatus) => {
    try {
        const response = await axios.get(patois_admin_url + `/shop/shopExportExcel/${shopStatus}`, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        const currentDate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss a")
        if (shopStatus === 1) {
            a.download = `NewShop_ShopApproval_${currentDate}.xlsx`;
        }
        if (shopStatus === 2) {
            a.download = `Approved_ShopApproval_${currentDate}.xlsx`;
        }
        if (shopStatus === 3) {
            a.download = `Rejected_ShopApproval_${currentDate}.xlsx`;
        }

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        return { success: true, message: 'ดาวน์โหลดไฟล์ Excel สำเร็จ' };
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดาวน์โหลด Excel: ', error);
        return { success: false, message: 'เกิดข้อผิดพลาดในการดาวน์โหลด Excel' };
    }
};

function catchError(error, path, func) {
    try {

        return;
    } catch (err) {
        console.error("Response catchError : ", error);
        console.log(err);
        return;
    }

}
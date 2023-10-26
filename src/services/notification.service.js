import axios from "axios";
import {checkToken} from './role.service'

const patois_admin_url = process.env.REACT_APP_PATOIS_ADMIN_API_URI;
const patois_url = process.env.REACT_APP_PATOIS_API_URI;
const patois_microservice_api_url = process.env.REACT_APP_PATOIS_MICROSERVICE_API_URI;

export const sendNotificationService = async (title, description, withs, notificationType = "report_admin_manual", ref_id = null) => {

    let notificationData = {
        "user_id": null,
        "withs": withs,
        "vTitle": title,
        "vDescription": description,
        "vTypes": notificationType,
        "ref_id": ref_id //shopId
    }
    // console.log("notificationData: ", notificationData);
    return await axios.post(patois_url + '/api/notification', notificationData).then(res => {
        console.log("res", res);
        return res
    }).catch((err) => {
        console.log("err: ", err);
    });
}


export const sendNotificationToFollowerService = async (userId, shopId) => {

    let notificationData = {
        userId: userId,
        shopId: shopId,
    }
    
    return await axios.post(patois_microservice_api_url + '/api/notification/sendNotificationToFollower', notificationData).then(res => {
        console.log("res", res);
        return res
    }).catch((err) => {
        console.log("err: ", err);
    });
}


export const getNotificationByUserIdService = async (userId) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + '/notification/user-id/' + userId, { headers }).then(res => {
        return res.data.data;
    }).catch((err) => {
        return [];
    });
}
export const getNotificationByUserTelService = async (userTel) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + '/notification/user-tel/' + userTel, { headers }).then(res => {
        return res.data.data;
    }).catch((err) => {
        return [];
    });
}
export const getNotificationByMaxcardIdService = async (maxcardId) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + '/notification/maxcard-id/' + maxcardId, { headers }).then(res => {
        return res.data.data;
    }).catch((err) => {
        return [];
    });
}

export const deleteNotificationByNotificationIdService = async (notificationId) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.delete(patois_admin_url + '/notification/' + notificationId, { headers }).then(res => {
        return res.data;
    }).catch((err) => {
        return {};
    });
}
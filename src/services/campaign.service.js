import axios from "axios";
import {checkToken} from './role.service'

const patois_admin_url = process.env.REACT_APP_PATOIS_ADMIN_API_URI;
const patois_url = process.env.REACT_APP_PATOIS_API_URI;

export const getCamapaignService = async () => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + '/campaign/', { headers }).then(res => {
        // console.log("getCamapaignService res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getCamapaignService");
        return [];
    });
}

export const createCampaignService = async (data) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.post(patois_admin_url + '/campaign/', data, { headers }).then(res => {
        // console.log("res", res);
        return res.data
    }).catch((err) => {
        console.log("err: ", err.response);
        return err?.response?.data ? err?.response?.data : {};
    });
}

export const createCampaignUserService = async (data, campaignId) => {

    let newData = {};

    newData.campaign_id = campaignId;
    newData.giver_id = data.id;
    newData.ref_code = data.user_code;
    console.log("newData: ", newData);

    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.post(patois_admin_url + '/campaign-user/', newData, { headers }).then(res => {
        // console.log("res", res);
        return res.data
    }).catch((err) => {
        console.log("err: ", err.response);
        return err?.response?.data ? err?.response?.data : {};
    });
}


export const editCampaignService = async (data) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.put(patois_admin_url + '/campaign/', data, { headers }).then(res => {
        // console.log("res", res);
        return res.data
    }).catch((err) => {
        console.log("err: ", err.response);
        return err?.response?.data ? err?.response?.data : {};
    });
}

export const getCampaignByCampaignIdService = async (campaignId) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + '/campaign/' + campaignId, { headers }).then(res => {
        // console.log("getCamapaignService res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getCampaignByCampaignIdService");
        return [];
    });
}

export const getCamapaignReferralByCampaignIdService = async (campaignId) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + '/campaign-user/campaign-id/' + campaignId, { headers }).then(res => {
        // console.log("getCamapaignService res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getCamapaignReferralByCampaignIdService");
        return [];
    });
}

export const deleteCampaignIdService = async (campaignId) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.delete(patois_admin_url + '/campaign/' + campaignId, { headers }).then(res => {
        // console.log("getCamapaignService res", res);
        return res.data;
    }).catch((err) => {
        catchError(err, null, "deleteCampaignIdService");
        return [];
    });
}
export const deleteCampaignUserIdService = async (campaignUserId) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.delete(patois_admin_url + '/campaign-user/' + campaignUserId, { headers }).then(res => {
        // console.log("getCamapaignService res", res);
        return res.data;
    }).catch((err) => {
        catchError(err, null, "deleteCampaignUserIdService");
        return [];
    });
}

export const getCamapaignReferralByPage = async (tableParam, campaignId) => {
    return await axios.get(patois_admin_url + `/campaign-user/getCampaignUserByPage?pageNumber=${tableParam.pagination.current}&rowsOfPage=${tableParam.pagination.pageSize}&campaignId=${campaignId}`).then(res => {
        console.log("getCamapaignReferralByPage res", res);
        return res.data;
    }).catch((err) => {
        catchError(err, null, "getCamapaignReferralByPage");
        return [];
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
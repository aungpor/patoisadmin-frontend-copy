import axios from "axios";

const patois_admin_url = process.env.REACT_APP_PATOIS_ADMIN_API_URI;
const patois_url = process.env.REACT_APP_PATOIS_CONTENT_API_URI;

export const getManualUserProviderService = async () => {
    return await axios.get(patois_admin_url + '/user/').then(res => {
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getShopType");
        return [];
    });
}

export const getManualUserByUserIdService = async (userId) => {
    return await axios.get(patois_admin_url + '/user/' + userId).then(res => {
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getShopByShopIdService");
        return {};
    });
}

export const creatUserService = async (data) => {

    data = {
        ...data,
        "password": null,
        "remember_token": null,
        "line_id": "0",
        "profile_pic_line": null,
        "active": "1",
        "groups_id": 2,
        "profile_pic_patois": null,
        "patois_maxcard_id": null,
        "provider": "manual",
        "pdpa_id": 1,
        "pdpa_version": "1.0.0.1",
        "pdpa_isagree": true,
    }

    return await axios.post(patois_admin_url + '/user/', data).then(res => {
        return res.data;
    }).catch((err) => {
        catchError(err, null, "updateUserService");
        return err.response.data ? err.response.data : {};
    });
}

export const updateUserService = async (data) => {
    return await axios.put(patois_admin_url + '/user/', data).then(res => {
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "updateUserService");
        return {};
    });
}


export const getUserByUserIdService = async (userId) => {
    return await axios.get(patois_admin_url + '/user/user-id/' + userId).then(res => {
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getUserByUserId");
        return [];
    });
}

export const getUserByUserTelService = async (userTel) => {
    return await axios.get(patois_admin_url + '/user/user-tel/' + userTel).then(res => {
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getUserByUserTel");
        return [];
    });
}

export const getUserByUserUsernameService = async (username) => {
    return await axios.get(patois_admin_url + '/user/name/' + username).then(res => {
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getUserByUserUsername");
        return [];
    });
}

export const getUserByUserMaxcardIdService = async (maxcardId) => {
    return await axios.get(patois_admin_url + '/user/maxcard-id/' + maxcardId).then(res => {
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getUserByUserMaxcardId");
        return [];
    });
}

export const getReviewHistory = async (userId, searchText = '', pageNumber = 1, rowsOfPage = 20, searchReviewType = 'ALL') => {
    const reqUrl = `/api/shop/admin/user/reviewHistory?pageNumber=${pageNumber}&rowsOfPage=${rowsOfPage}&userId=${userId}&searchReviewType=${searchReviewType}&searchText=${searchText}`

    return await axios.get(patois_url + reqUrl).then(res => {
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getReviewHistory");
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
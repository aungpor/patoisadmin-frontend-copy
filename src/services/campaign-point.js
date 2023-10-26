import axios from "axios";

const patois_admin_url = process.env.REACT_APP_PATOIS_ADMIN_API_URI;
const patois_url = process.env.REACT_APP_PATOIS_API_URI;

export const getCurrentPointService = async (shop_id, point_type) => {
    let data = {
        "point_type": point_type,
        "user_id": null,
        "shop_id": shop_id,
        "review_id": null,
    }
    return await axios.post(patois_url + '/api/campaign/campaignPoint/point', data).then(res => {
        // console.log("res", res);
        return res.data.data[0]
    }).catch((err) => {
        console.log("err: ", err.response);
        return err?.response?.data ? err?.response?.data : {};
    });
}
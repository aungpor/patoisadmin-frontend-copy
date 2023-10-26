import axios from "axios";
import CryptoJS from 'crypto-js';

const patois_url = process.env.REACT_APP_PATOIS_CONTENT_API_URI;

export const maxCardService = {
  getMaxcardCheck: async (maxCardNo) => {
    const requestOptions = {
      method: "GET",
      headers: authHeader(),
    };
    return await fetch(
      `${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/check?maxCardNo=${maxCardNo}`,
      requestOptions
    )
      .then((data) => {
        return data;
      })
      .catch(error => catchError(error));

  },

  getMaxcardInfo: async () => {
    const requestOptions = {
      method: "GET",
      headers: authHeader(),
    };
    return await fetch(
      `${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/info`,
      requestOptions
    )
      .then((data) => {
        return data;
      })
      .catch(error => catchError(error));

  },
  getPointDraft: async () => {
    const requestOptions = {
      method: "GET",
      headers: authHeader(),
    };

    return await fetch(
      `${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/reward/getPointDraft`,
      requestOptions
    )
      .then((data) => {
        return data;
      })
      .catch(error => catchError(error));

  },
  getMaxcardInfoByUserId: async (userId) => {
    const requestOptions = {
      method: "GET",
      headers: authHeader(),
    };
    return await fetch(
      `${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/info/id?userId=${userId}`,
      requestOptions
    )
      .then((data) => {
        return data;
      })
      .catch(error => catchError(error));

  },

  getProfileByMaxcardId: async (maxcardId) => {
    const requestOptions = {
      method: "GET",
      headers: authHeader(),
    };
    return await fetch(
      `${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/profile/maxcardId?maxcardId=${maxcardId}`,
      requestOptions
    )
      .then((data) => {
        return data;
      })
      .catch(error => catchError(error));

  },
  getProfileByPhoneNo: async (phoneNo) => {
    const requestOptions = {
      method: "GET",
      headers: authHeader(),
    };
    return await fetch(
      `${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/profile/phone?phoneNo=${phoneNo}`,
      requestOptions
    )
      .then((data) => {
        return data;
      })
      .catch(error => catchError(error));

  },

  addPatoisMaxCard: (maxcard) => {
    const requestOptions = {
      method: "POST",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        maxcard
      }),
    };

    return fetch(`${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/bind`, requestOptions)
      .then((data) => {
        return data;
      })
      .catch(error => catchError(error));

  },
  updatePatoisMaxcardStatus: (patoisMaxcard, maxcardId) => {
    const requestOptions = {
      method: "PUT",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        patoisMaxcard
      }),
    };

    return fetch(`${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/status/${maxcardId}`, requestOptions)
      .then((data) => {
        return data;
      })
      .catch(error => catchError(error));

  },
  CrmRewardPointAdmin: (rewardPoint) => {
    console.log("CrmRewardPointAdmin: ");
    try {
      let body = CryptoJS.AES.encrypt(
        JSON.stringify({ ...rewardPoint }),
        process.env.REACT_APP_SECRET_KEY
      ).toString();
      // console.log("body encrypt: ", body);
      const requestOptions = {
        method: "POST",
        headers: {
          ...authHeader(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: body }),
      };

      return fetch(`${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/admin/reward/point`, requestOptions)
        .then(response => response.json())
        .then((data) => {
          console.log("CrmRewardPointAdmin data: ", data);
          return data;
        })
        .catch(error => {
          console.log("CrmRewardPointAdmin error", error);
        });
    } catch (error) {
      console.log("CrmRewardPointAdmin error", error);
      catchError(error)
    }
  },
  getServerDateTime: async () => {
    const requestOptions = {
      method: "GET",
      headers: authHeader(),
    };
    return await fetch(
      `${process.env.REACT_APP_PATOIS_API_URI}/api/system/serviceUtils/getDateTimeFormat1`,
      requestOptions
    )
      .then(response => response.json())
      .then((data) => {
        console.log("getServerDateTime: data", data);
        return data;
      })
      .catch(error => catchError(error));
  },
  getTransaction: (unitTime, redirect) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          ...authHeader(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "ref_type": "1",
          "unix_time": unitTime,
          "page": redirect
        }),
      };

      return fetch(`${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/mapping/crm/transaction`, requestOptions)
        .then((data) => {
          return data;
        })
        .catch(error => catchError(error));
    } catch (error) {
      catchError(error)
    }
  },
  updateTransaction: (data) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          ...authHeader(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...data
        }),
      };

      return fetch(`${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/mapping/crm/updateTransaction`, requestOptions)
        .then((data) => {
          return data;
        })
        .catch(error => catchError(error));
    } catch (error) {
      catchError(error)
    }
  },
  transactionLog: (data) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          ...authHeader(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...data
        }),
      };

      return fetch(`${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/mapping/crm/transactionLog`, requestOptions)
        .then((data) => {
          return data;
        })
        .catch(error => catchError(error));
    } catch (error) {
      catchError(error)
    }
  },

  transferPointDraft: async () => {
    const requestOptions = {
      method: "GET",
      headers: authHeader(),
    };
    return await fetch(
      `${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/reward/transferPointDraft`,
      requestOptions
    )
      .then(error => catchError(error))
      .then((data) => {
        return data;
      })
      .catch(error => catchError(error));
  },
  getUserMaxCardAdmin: async (userId) => {
    const requestOptions = {
      method: "GET",
      headers: authHeader(),
    };
    return await fetch(
      `${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/admin/getUserMaxCard/${userId}`,
      requestOptions
    )
      .then(response => response.json())
      .then((data) => {
        return data;
      })
      .catch(error => catchError(error));
  },
  postPointDraftAdmin: (rewardPoint) => {
    console.log("postPointDraftAdmin: ");
    try {
      let body = CryptoJS.AES.encrypt(
        JSON.stringify({ ...rewardPoint }),
        process.env.REACT_APP_SECRET_KEY
      ).toString();

      console.log("body encrypt: ", body);
      const requestOptions = {
        method: "POST",
        headers: {
          ...authHeader(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: body }),
      };

      return fetch(`${process.env.REACT_APP_PATOIS_API_URI}/api/maxcard/admin/reward/pointDraft`, requestOptions)
        .then(response => response.json())
        .then((data) => {
          console.log("postPointDraftAdmin data: ", data);
          return data;
        })
        .catch(error => catchError(error));
    } catch (error) {
      catchError(error)
    }
  },
  handleSendMaxpoint: async (shopData, productQaun, promoCode) => {

    let PRODUCT_QUAN = productQaun ? productQaun : 30
    let referenceId = shopData.shop_id
    let referenceType = 'reviewShop' //ต้องเปลี่ยนไหม
    let promosCode = promoCode
    // let promosCode = 'PTR004'

    const now = new Date();
    const day =
      ('0' + now.getDate()).slice(-2) +
      ('0' + (now.getMonth() + 1)).slice(-2) +
      now.getFullYear();

    const serverDateTime = await maxCardService.getServerDateTime();
    const userMaxCard = await maxCardService.getUserMaxCardAdmin(shopData.user_id);

    let reqBody = {
      MID: '396221113400001',
      TID: '99999999',
      BATCH_ID: day,
      STAND_ID: '24',
      CARD_NO: userMaxCard?.data?.data[0]?.patois_maxcard_no ? userMaxCard?.data?.data[0]?.patois_maxcard_no : "",
      PRODUCT_CODE: '4101001000002',
      PRODUCT_PRICE: '1.00',
      PRODUCT_QUAN: `${PRODUCT_QUAN}.0`,
      TIME: serverDateTime?.data,
      referenceId: referenceId,
      referenceType: referenceType,
      promosCode: promosCode,
      userId: shopData.user_id
    }
    // console.log("reqBody:", reqBody);

    if (userMaxCard?.data?.data?.length) await maxCardService.CrmRewardPointAdmin(reqBody);
    else await maxCardService.postPointDraftAdmin(reqBody);
  },
};

export const getPointHistory = async (userId, pageNumber = 1, rowsOfPage = 20) => {
  const reqUrl = `/api/maxcard/admin/user/pointHistory?pageNumber=${pageNumber}&rowsOfPage=${rowsOfPage}&userId=${userId}`

  return await axios.get(patois_url + reqUrl).then(res => {
      return res.data.data;
  }).catch((err) => {
      catchError(err, null, "getPointHistoryHistory");
      return [];
  });
}

export const getPointHistoryInfo = async (interfaceLogId) => {
  const reqUrl = `/api/maxcard/admin/user/pointHistoryInfo?interfaceLogId=${interfaceLogId}`

  return await axios.get(patois_url + reqUrl).then(res => {
      return res.data.data;
  }).catch((err) => {
      catchError(err, null, "getPointHistoryHistory");
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

export function authHeader() {
  // return authorization header with jwt token
  var tokenCurrent = localStorage.getItem("token");
  let token = tokenCurrent === "undefined" ? {} : JSON.parse(tokenCurrent);

  if (token && token.token) {
    // return { Authorization: "Bearer " + token.token };
    return { token: "Bearer " + token.token, refreshToken: "Bearer " + token.refreshToken };
    //Below for test
    // return { token: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0OTUsImVtYWlsIjoicHVfcm9iaW5ob29kQGhvdG1haWwuY29tIiwidGVsIjoiIiwibmFtZSI6IlB1IiwiZ3JvdXBzaWQiOjIsImlzQmluZE1heGNhcmQiOmZhbHNlLCJwYXRvaXNNYXhjYXJkSWQiOm51bGwsImlhdCI6MTYzOTU4NjEzNywiZXhwIjoxNjM5OTMxNzM3fQ.8XikQbE5kwPZbppqWc2NXtiynU0GaLzR-ryvwWR3EYc", refreshToken: "Bearer " + token.refreshToken };
  } else {
    return {};
  }
}

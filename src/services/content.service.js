import axios from "axios";
import { maxCardService } from '../services/maxCard.service';
import moment from "moment";

const patois_admin_url = process.env.REACT_APP_PATOIS_ADMIN_API_URI;
const patois_url = process.env.REACT_APP_PATOIS_CONTENT_API_URI;
// const patois_url = "https://uat-patois-api-asv.azurewebsites.net";

// export const getShopByShopIdService = async (shopId) => {
//     return await axios.get(patois_url + '/api/shop/allaction/' + shopId).then(res => {
//         console.log("getShopByShopIdService res", res);
//         return res.data.data[0];
//     }).catch((err) => {
//         catchError(err, null, "getShopByShopIdService");
//         return {};
//     });
// }

export const getAllCatagory = async () => {
    return await axios.get(patois_url + '/api/shop/content/getAllCategory').then(res => {
        console.log("getAllCategory res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getAllCategory");
        return {};
    });
}

export const getCategory = async (catrgoryId) => {
    return await axios.get(patois_url + `/api/shop/categories/cms/getCategoryById/${catrgoryId}`).then(res => {
        console.log("getAllCategory res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getCategoryById");
        return {};
    });
}

export const getCategorySearch = async (tableParam, data) => {
    return await axios.get(patois_url + `/api/shop/categories/cms/searchCategories?pageNumber=${tableParam.pagination.current}&rowsOfPage=${tableParam.pagination.pageSize}&text=${data}`).then(res => {
        console.log("getAllCategory res", res);
        return res.data;
    }).catch((err) => {
        catchError(err, null, "getCategorySearch");
        return {};
    });
}

// export const getCategorySearch = async (tableParam, data) => {
//     const headers = { 'token': localStorage.getItem("userToken") };
//     return await axios.get(patois_url + `/api/shop/categories/cms/searchCategories?pageNumber=${tableParam.pagination.current}&rowsOfPage=${tableParam.pagination.pageSize}&text=${data}`, { headers }).then(res => {
//         console.log("getAllCategory res", res);
//         return res.data;
//     }).catch((err) => {
//         catchError(err, null, "getCategorySearch");
//         return {};
//     });
// }

export const getCategorySearchByName = async (categoryName) => {
    return await axios.get(patois_url + `/api/shop/categories/cms/searchCategories?pageNumber=1&rowsOfPage=1&text=${categoryName}`).then(res => {
        console.log("getAllCategory res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getCategorySearch");
        return {};
    });
}

export const getSubCategorySearchByName = async (subCategoryName) => {
    return await axios.get(patois_url + `/api/shop/subCategories/cms/searchSubCategories?pageNumber=1&rowsOfPage=1&text=${subCategoryName}`).then(res => {
        console.log("getAllCategory res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getCategorySearch");
        return {};
    });
}

export const addCategory = async (data) => {
    return await axios.post(patois_url + '/api/shop/categories/cms/addCategories', data).then(res => {
        console.log("addCategory res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "addCategory");
        return {};
    });
}

export const editCategory = async (categoryId, data) => {
    return axios.put(patois_url + `/api/shop/categories/cms/editCategory/${categoryId}`, data).then(res => {
        console.log("edit category res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "edit category res")
    })
}

export const deleteCategory = async (data) => {
    return await axios.put(patois_url + '/api/shop/categories/cms/deleteCategory', data).then(res => {
        console.log("deleteCategory res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "deleteCategory");
        return {};
    });
}

export const getAllSubCategory = async () => {
    return await axios.get(patois_url + `/api/shop/subCategories/cms/searchSubCategories?pageNumber=1&rowsOfPage=100000`).then(res => {
        console.log("getAllCategory res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getAllSubCategory");
        return {};
    });
}

export const getSelectSubCategory = async () => {
    return await axios.get(patois_url + `/api/shop/subCategories/cms/getSelectSubCategory`).then(res => {
        console.log("getSelectSubCategory res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getSelectSubCategory");
        return {};
    });
}

export const getSubCatagory = async (contentCategoryId) => {
    return await axios.get(patois_url + `/api/shop/content/getSubCategoryByCategoryId?contentCategoryId=${contentCategoryId}`).then(res => {
        console.log("getSubCategoryByCategoryId res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getSubCategoryByCategoryId");
        return {};
    });
}

export const getSubCategorySearch = async (tableParam, data) => {
    return await axios.get(patois_url + `/api/shop/subCategories/cms/searchSubCategories?pageNumber=${tableParam.pagination.current}&rowsOfPage=${tableParam.pagination.pageSize}&text=${data}`).then(res => {
        console.log("getAllCategory res", res);
        return res.data;
    }).catch((err) => {
        catchError(err, null, "getSubCategorySearch");
        return {};
    });
}

export const getSubCategorySearchById = async (data) => {
    return await axios.get(patois_url + `/api/shop/subCategories/cms/searchSubCategories?pageNumber=1&rowsOfPage=1&text=${data}`).then(res => {
        console.log("getAllCategory res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getSubCategorySearch");
        return {};
    });
}

export const addSubCategory = async (data) => {
    return await axios.post(patois_url + '/api/shop/subCategories/cms/addSubCategories', data).then(res => {
        console.log("addSubCategory res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "addSubCategory");
        return {};
    });
}

export const editSubCategory = async (subCategoryId, data) => {
    return axios.put(patois_url + `/api/shop/subCategories/cms/editSubCategory/${subCategoryId}`, data).then(res => {
        console.log("edit subcategory res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "edit subcategory res")
    })
}

export const assignSubCategory = async (subCategoryId, data) => {
    return axios.put(patois_url + `/api/shop/subCategories/cms/assignSubCategories/${subCategoryId}`, data).then(res => {
        console.log("assign subcategory res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "assign subcategory res")
    })
}

export const deleteSubCategory = async (data) => {
    return await axios.put(patois_url + '/api/shop/subCategories/cms/deleteSubCategory', data).then(res => {
        console.log("deleteSubCategory res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "deleteSubCategory");
        return {};
    });
}

export const getAllTag = async () => {
    return await axios.get(patois_url + '/api/shop/content/getAllTag?active=1&pageNumber=1&rowsOfPage=100').then(res => {
        console.log("getAllTag res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getAllTag");
        return {};
    });
}

export const addTag = async (data) => {
    return await axios.post(patois_url + '/api/shop/content/addTag',data).then(res => {
        console.log("addTag res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "addTag");
        return {};
    });
}

export const createContent = async (data) => {
    return await axios.post(patois_url + '/api/shop/content/createContent/', data).then(res => {
        console.log("createContent res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "createContent");
        return {};
    });
}

export const getContentList = async (tableParam) => {
    return axios.get(patois_url + `/api/shop/content/list/content?pageNumber=${tableParam.pagination.current}&rowsOfPage=${tableParam.pagination.pageSize}&status=save`).then(res => {
        console.log("content list res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "content list res")
        return {};
    })
}

export const getContentDetail = async (contentId) => {
    return axios.get(patois_url + `/api/shop/content/view/content?content_id=${contentId}`).then(res => {
        console.log('view content res', res);
        return res.data
    }).catch((err) => {
        catchError(err, null, 'view content')
        return {}
    })
}

export const getDraftList = async (tableParam) => {
    return axios.get(patois_url + `/api/shop/content/list/content?pageNumber=${tableParam.pagination.current}&rowsOfPage=${tableParam.pagination.pageSize}&status=draft`).then(res => {
        console.log("content list res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "content list res")
        return {};
    })
}

export const editContent = async (contentId, data) => {
    return axios.put(patois_url + `/api/shop/content/edit/content/${contentId}`, data).then(res => {
        console.log("edit content res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "edit content res")
    })

}

export const getContentCarouselBanner = async (tableParam) => {
    return axios.get(patois_url + `/api/shop/content/cms/getContentCarouselBannerCms?pageNumber=${tableParam.pagination.current}&rowsOfPage=${tableParam.pagination.pageSize}`).then(res => {
        console.log("Content Carousel Banner Cms res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "Content Carousel Banner Cms res")
    })
}

export const getSugessionContent = async (tableParam) => {
    return axios.get(patois_url + `/api/shop/content/cms/getSugessionContentCms?pageNumber=${tableParam.pagination.current}&rowsOfPage=${tableParam.pagination.pageSize}`).then(res => {
        console.log("Sugession Content Cms", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "Sugession Content Cms")
    })
}

export const getAdsBanner = async (tableParam) => {
    return axios.get(patois_url + `/api/shop/content/cms/getAdsBannerCms?pageNumber=${tableParam.pagination.current}&rowsOfPage=${tableParam.pagination.pageSize}`).then(res => {
        console.log("Ads Banner Cms", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "Ads Banner Cms")
    })
}

export const getImageAndTitleByContentId = async (contentId) => {
    return axios.get(patois_url + `/api/shop/content/cms/getImageAndTitleByContentId?contentId=${contentId}`).then(res => {
        console.log("Get Image And Title By Content Id", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "Get Image And Title By Content Id")
    })
}

export const editContentCarouselBanner = async (data) => {
    return axios.put(patois_url + `/api/shop/content/cms/saveContentCarouselBanner`, data).then(res => {
        console.log("edit content carousel banner res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "edit content carousel banner res")
    })

}

export const editContentSugession = async (data) => {
    return axios.put(patois_url + `/api/shop/content/cms/saveContentSugession`, data).then(res => {
        console.log("edit content sugession res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "edit content sugession res")
    })

}

export const editContentAdsBanner = async (data) => {
    return axios.put(patois_url + `/api/shop/content/cms/saveContentAdsBanner`, data).then(res => {
        console.log("edit content ads banner res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "edit content ads banner res")
    })

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

import axios from "axios";
import { maxCardService } from '../services/maxCard.service';
import moment from "moment";
import { async } from "q";

const patois_admin_url = process.env.REACT_APP_PATOIS_ADMIN_API_URI;
const patois_url = process.env.REACT_APP_PATOIS_CONTENT_API_URI;

export const getUserByEmail = async (email) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + `/admin-user/getActiveUserByEmail/${email}`, { headers }).then(res => {
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getUserByEmail");
        return {};
    });
}

export const addUser = async (data) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.post(patois_admin_url + '/admin-user/addUser', data, { headers }).then(res => {
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "addUser");
        return {};
    });
}

export const getUserRole = async (userId) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + `/admin-role/getUserRole/${userId}`, { headers }).then(res => {
        console.log("getUserRole res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "getUserRole");
        return {};
    });
}

export const getAllRole = async () => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + `/admin-role`, { headers }).then(res => {
        console.log("getAllRole res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "getAllRole");
        return {};
    });
}

export const getAllUser = async () => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + `/admin-user`, { headers }).then(res => {
        console.log("getAllUser res", res);
        return res.data.data
    }).catch(async (err) => {
        catchError(err, null, "getAllUser");
        return {};
    });
}

export const getPermissionByRoleId = async (roleId) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + `/admin-role/getPermissionByRoleId/${roleId}`, { headers }).then(res => {
        console.log("getPermissionByRoleId res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "getPermissionByRoleId");
        return {};
    });
}

export const getAllPermission = async () => {
    return await axios.get(patois_admin_url + `/admin-role/getAllPermission`).then(res => {
        console.log("getAllPermission res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "getAllPermission");
        return {};
    });
}

export const addRole = async (data) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.post(patois_admin_url + '/admin-role/addRole', data, { headers }).then(res => {
        console.log("addRole res", res);
        return res.data.data
    }).catch(async (err) => {
        catchError(err, null, "addRole");
        return {};
    });
}

export const getRoleByName = async (roleName) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + `/admin-role/getRoleByName/${roleName}`, { headers }).then(res => {
        console.log("getRoleByName res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "getRoleByName");
        return {};
    });
}

export const assignRolePermission = async (data) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.post(patois_admin_url + '/admin-role/assignRolePermission', data, { headers }).then(res => {
        console.log("assiginRole res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "assiginRole");
        return {};
    });
}

export const editRolePermission = async (data) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.put(patois_admin_url + '/admin-role/editRolePermission', data, { headers }).then(res => {
        console.log("editRolePermission res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "editRolePermission");
        return {};
    });
}

export const getRoleById = async (roleId) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + `/admin-role/getRoleById/${roleId}`, { headers }).then(res => {
        console.log("getRoleById res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "getRoleById");
        return {};
    });
}

export const editRole = async (data) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.put(patois_admin_url + '/admin-role/editRole', data, { headers }).then(res => {
        console.log("editRole res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "editRole");
        return {};
    });
}

export const assignUserRole = async (data) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.post(patois_admin_url + '/admin-role/assignUserRole', data, { headers }).then(res => {
        console.log("assignUserRole res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "assignUserRole");
        return {};
    });
}

export const editAssignRole = async (data) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.put(patois_admin_url + '/admin-role/editAssignRole', data, { headers }).then(res => {
        console.log("editAssignRole res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "editAssignRole");
        return {};
    });
}

export const checkAssignRole = async (userId, roleId) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + `/admin-role/checkAssignRole?userId=${userId}&roleId=${roleId}`, { headers }).then(res => {
        console.log("checkAssignRole res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "checkAssignRole");
        return {};
    });
}

export const deleteRole = async (data) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.put(patois_admin_url + '/admin-role/deleteRole', data, { headers }).then(res => {
        console.log("deleteRole res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "deleteRole");
        return {};
    });
}

export const getPermissionByUserId = async (userId) => {
    return await axios.get(patois_admin_url + `/admin-role/getPermissionByUserId/${userId}`).then(res => {
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getPermissionByUserId");
        return {};
    });
}

export const getUserById = async (userId) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + `/admin-user/getUserById/${userId}`, { headers }).then(res => {
        console.log("getUserById res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getUserById");
        return {};
    });
}

export const deleteAssignRole = async (data) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.put(patois_admin_url + '/admin-role/deleteAssignRole', data, { headers }).then(res => {
        console.log("deleteAssignRole res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "deleteAssignRole");
        return {};
    });
}

export const getUserByPage = async (tableParam) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + `/admin-user/getUserByPage?pageNumber=${tableParam.pagination.current}&rowsOfPage=${tableParam.pagination.pageSize}`, { headers }).then(res => {
        console.log("getUserByPage res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "getUserByPage");
        return {};
    });
}

export const checkRolePermission = async (roleId, permissionId) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + `/admin-role/checkRolePermission?roleId=${roleId}&permissionId=${permissionId}`, { headers }).then(res => {
        console.log("checkRolePermission res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "checkRolePermission");
        return {};
    });
}

export const checkDeleteAssignRole = async (roleId) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + `/admin-role/checkDeleteAssignRole?roleId=${roleId}`, { headers }).then(res => {
        console.log("checkDeleteAssignRole res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "checkDeleteAssignRole");
        return {};
    });
}

export const createToken = async (data) => {
    return await axios.post(patois_admin_url + '/admin-user/createToken', data).then(res => {
        return res.data
    }).catch((err) => {
        catchError(err, null, "createToken");
        return {};
    });
}

export const refreshToken = async (data) => {
    const headers = { 'token': localStorage.getItem("userToken"), refreshToken: localStorage.getItem("userRefreshToken") };
    return await axios.post(patois_admin_url + '/admin-user/refreshToken', data, { headers }).then(res => {
        console.log("refreshToken res", res);
        localStorage.setItem('userToken', res.data.accessToken)
        localStorage.setItem('userRefreshToken', res.data.refreshToken)
    }).catch((err) => {
        catchError(err, null, "refreshToken");
        return {};
    });
}

export const checkToken = async () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "[]");
    const userPermission = JSON.parse(localStorage.getItem("apiPermission") || "[]");
    const headers = { 'token': localStorage.getItem("userToken"), refreshToken: localStorage.getItem("userRefreshToken") };

    const data = {
        user_name: userData.user_name,
        user_email: userData.user_email,
        permission: userPermission
    }
    return await axios.post(patois_admin_url + '/admin-user/checkToken', data, { headers }).then(res => {
        console.log("checkToken res", res);
        if (res.data.accessToken) {
            localStorage.setItem('userToken', res.data.accessToken)
            localStorage.setItem('userRefreshToken', res.data.refreshToken)
        }
        return res.data
    }).catch((err) => {
        catchError(err, null, "checkToken");
        return {};
    });
}

export const getAllPermissionGroup = async () => {
    return await axios.get(patois_admin_url + `/admin-role/getPermissionGroup`).then(res => {
        console.log("getAllPermissionGroup res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "getAllPermissionGroup");
        return {};
    });
}

export const getApiPermissionByUserId = async (userId) => {
    return await axios.get(patois_admin_url + `/admin-role/getApiPermissionByUserId/${userId}`).then(res => {
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getApiPermissionByUserId");
        return {};
    });
}

export const editUser = async (data) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.put(patois_admin_url + `/admin-user/editUser`, data, { headers }).then(res => {
        console.log("editUser res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "editUser");
        return {};
    });
}

export const deleteUser = async (data) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.put(patois_admin_url + `/admin-user/deleteUser`, data, { headers }).then(res => {
        console.log("deleteUser res", res);
        return res.data.data
    }).catch((err) => {
        catchError(err, null, "deleteUser");
        return {};
    });
}

export const checkInActiveUserByEmail = async (email) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + `/admin-user/getInActiveUserByEmail/${email}`, { headers }).then(res => {
        console.log("checkInActiveUserByEmail res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "checkInActiveUserByEmail");
        return {};
    });
}

export const searchUser = async (tableParam, search) => {
    await checkToken()
    const headers = { 'token': localStorage.getItem("userToken") };
    return await axios.get(patois_admin_url + `/admin-user/searchUser?pageNumber=${tableParam.pagination.current}&rowsOfPage=${tableParam.pagination.pageSize}&search=${search}`, { headers }).then(res => {
        console.log("searchUser res", res);
        return res.data
    }).catch((err) => {
        catchError(err, null, "searchUser");
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
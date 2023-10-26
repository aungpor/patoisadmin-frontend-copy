import React, { useEffect, useState } from "react";
import { Route, useHistory } from "react-router-dom";
import { getPermissionByUserId } from "../services/role.service"

const ProtectedRoute = (props) => {
    const [permissionData, setPermissionData] = useState(false);
    const history = useHistory();

    const checkUserPermission = async () => {
        console.log(props);
        const routePermisssion = props.permission
        const userData = JSON.parse(localStorage.getItem("userData") || "[]");
        const userPermission = await getPermissionByUserId(userData.user_id)

        const checkPermission = routePermisssion.every(permissionId =>
            userPermission.some(permission => permission === permissionId)
        )

        console.log(routePermisssion);
        console.log(userPermission);
        console.log(checkPermission);

        if (userPermission === null || !checkPermission ) {
            setPermissionData(false);
            console.log("permission fail");
            return history.push('/');
        }
        console.log("permission pass");
        setPermissionData(true);
    }

    useEffect(() => {
        checkUserPermission();
    }, [permissionData]);

    return (
        <React.Fragment>
            {
                permissionData ? props.children : null
            }
        </React.Fragment>
    );
}



export default ProtectedRoute;
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import { useMsal, useAccount } from "@azure/msal-react";
import { useLocation } from "react-router-dom";
import { Layout, Drawer, Affix } from "antd";
import { getUserByEmail, addUser, getApiPermissionByUserId, getPermissionByUserId, createToken } from "../../services/role.service";
import Sidenav from "./Sidenav";
import Header from "./Header";
import Footer from "./Footer";

const { Header: AntHeader, Content, Sider } = Layout;

function Main({ children }) {
  const history = useHistory();
  const isAuthenticated = useIsAuthenticated();
  console.log("isAuthenticated: ", isAuthenticated);

  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [sidenavColor, setSidenavColor] = useState("#52c41a");
  const [sidenavType, setSidenavType] = useState("#fff");
  const [fixed, setFixed] = useState(true);
  const [permissions, setPermissions] = useState([])

  const openDrawer = () => setVisible(!visible);
  const handleSidenavType = (type) => setSidenavType(type);
  const handleSidenavColor = (color) => setSidenavColor(color);
  const handleFixedNavbar = (type) => setFixed(type);

  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});

  const checkUser = async () => {
    const user = await getUserByEmail(account.username)
    // const user = await getUserByEmail("user1@gmail.com")
    // const user = false

    if (user) {
      const permission = await getPermissionByUserId(user.user_id)
      const apiPermission = await getApiPermissionByUserId(user.user_id)
      setPermissions(permission)
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('permission', JSON.stringify(permission));
      localStorage.setItem('apiPermission', JSON.stringify(apiPermission));

      const tokenRes = await createToken({ user_id: user.user_id, user_name: account.name, user_email: account.username, permission: apiPermission })
      if (tokenRes) {
        localStorage.setItem('userToken', tokenRes.accessToken)
        localStorage.setItem('userRefreshToken', tokenRes.refreshToken)
      }
    }
    else {
      const permission = []
      const apiPermission = []
      setPermissions(permission)

      localStorage.setItem('permission', JSON.stringify(permission));
      localStorage.setItem('apiPermission', JSON.stringify(apiPermission));
    }
  }

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  useEffect(() => {
    if (pathname === "rtl") {
      setPlacement("left");
    } else {
      setPlacement("right");
    }
    checkUser()
  }, [pathname]);

  return (
    <Layout
      className={`layout-dashboard ${pathname === "profile" ? "layout-profile" : ""}`}
    >

      <Sider
        breakpoint="xs"
        width={250}
        theme="light"
        className={`sider-primary ant-layout-sider-primary ${sidenavType === "#fff" ? "active-route" : ""}`}
        style={{ background: sidenavType }}
      >
        <Sidenav color={sidenavColor} permissions={permissions} />
      </Sider>
      <Layout>
        <Affix>
          <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
            <Header
              onPress={openDrawer}
              name={pathname}
              subName={pathname}
              handleSidenavColor={handleSidenavColor}
              handleSidenavType={handleSidenavType}
              handleFixedNavbar={handleFixedNavbar}
            />
          </AntHeader>
        </Affix>

        <Content className="content-ant">{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default Main;

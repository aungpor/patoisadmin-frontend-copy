import { Switch, Route, Redirect } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import ProtectedRoute from './utils/ProtectedRoute'
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import ShopApproval from "./pages/shop/ShopApproval";
// import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import ShopApprovalBYShopId from "./pages/shop/ShopApprovalByShopId";
import InquiryShop from "./pages/shop/InquiryShop";
import Campaign from "./pages/campaign/Campaign";
import CreateCampagin from "./pages/campaign/Create-Campaign";
import ReferralUser from "./pages/user/ReferralUser";
import ReferralUserByUserId from "./pages/user/ReferralUserByUserId";
import CreateReferralUser from "./pages/user/CreateReferralUser";
import CampaignByCamapaignId from "./pages/campaign/CampaignByCampaignId";
import InquiryUser from "./pages/user/InquiryUser";
import NoticationUser from "./pages/user/NotificationUser";
import MaxpointUser from "./pages/user/MaxpointUser";
import ShopApprovalReport from "./pages/report/ShopApprovalReport";
import CreateContent from "./pages/contents/CreateContent";
import ContentsManagement from "./pages/contents/ContentsManagement";
import EditContent from "./pages/contents/EditContent"
import DraftManagement from "./pages/contents/DraftManagement"
import ConfigContents from "./pages/contents/ConfigContents"
import Categories from './pages/contents/Categories'
import SubCategories from './pages/contents/SubCategories'
import AddCategory from './pages/contents/AddCategory'
import EditCategory from './pages/contents/EditCategory'
import EditSubCategory from './pages/contents/EditSubCategory'
import RoleManagement from './pages/admin/RoleManagement'
import AddRole from './pages/admin/AddRole'
import EditRole from './pages/admin/EditRole'
import UserRole from './pages/admin/UserRole'
import EditUserRole from './pages/admin/EditUserRole'
import AddUser from './pages/admin/AddUser'
import KeywordManagement from './pages/seo/Keyword'
import UserPage from "./pages/activity/User";
import UserByIdPage from "./pages/activity/UserById";

function App() {
  return (
    <div className="App">
      <AuthenticatedTemplate>
        <Switch>
          {/* <Route exact path="/" component={Main} /> */}
          <Main>
            <Route exact path="/shop"><ProtectedRoute permission={["1"]}><ShopApproval/></ProtectedRoute></Route>
            <Route exact path="/shop/:id"><ProtectedRoute permission={["1"]}><ShopApprovalBYShopId/></ProtectedRoute></Route>
            <Route exact path="/inquiry-shop"><ProtectedRoute permission={["2"]}><InquiryShop/></ProtectedRoute></Route>
            <Route exact path="/campaign"><ProtectedRoute permission={["3"]}><Campaign/></ProtectedRoute></Route>
            <Route exact path="/campaign/:id"><ProtectedRoute permission={["3"]}><CampaignByCamapaignId/></ProtectedRoute></Route>
            <Route exact path="/create-campaign"><ProtectedRoute permission={["3"]}><CreateCampagin/></ProtectedRoute></Route>
            <Route exact path="/referral-user"><ProtectedRoute permission={["6"]}><ReferralUser/></ProtectedRoute></Route>
            <Route exact path="/referral-user/:id"><ProtectedRoute permission={["6"]}><ReferralUserByUserId/></ProtectedRoute></Route>
            <Route exact path="/create-referral-user"><ProtectedRoute permission={["6"]}><CreateReferralUser/></ProtectedRoute></Route>
            <Route exact path="/user"><ProtectedRoute permission={["7"]}><InquiryUser/></ProtectedRoute></Route>
            <Route exact path="/notification"><ProtectedRoute permission={["8"]}><Route exact path="/notification" component={NoticationUser} /></ProtectedRoute></Route>
            <Route exact path="/maxpoint"><ProtectedRoute permission={["9"]}><MaxpointUser/></ProtectedRoute></Route>
            <Route exact path="/create-contents"><ProtectedRoute permission={["11"]}><CreateContent/></ProtectedRoute></Route>
            <Route exact path="/contents-management"><ProtectedRoute permission={["11"]}><ContentsManagement/></ProtectedRoute></Route>
            <Route exact path="/edit-content/:id/:status"><ProtectedRoute permission={["11"]}><EditContent/></ProtectedRoute></Route>
            <Route exact path="/report/shop-approval"><ProtectedRoute permission={["10"]}><ShopApprovalReport/></ProtectedRoute></Route>
            <Route exact path="/content-drft-list"><ProtectedRoute permission={["12"]}><DraftManagement/></ProtectedRoute></Route>
            <Route exact path="/config-contents"><ProtectedRoute permission={["13"]}><ConfigContents/></ProtectedRoute></Route>
            <Route exact path="/categories"><ProtectedRoute permission={["14"]}><Categories/></ProtectedRoute></Route>
            <Route exact path="/categories/sub-categories"><ProtectedRoute permission={["14"]}><SubCategories/></ProtectedRoute></Route>
            <Route exact path="/categories/add-category"><ProtectedRoute permission={["14"]}><AddCategory/></ProtectedRoute></Route>
            <Route exact path="/categories/edit-category/:id"><ProtectedRoute permission={["14"]}><EditCategory/></ProtectedRoute></Route>
            <Route exact path="/categories/edit-sub-category/:id"><ProtectedRoute permission={["14"]}><EditSubCategory/></ProtectedRoute></Route>
            <Route exact path="/role-management"><ProtectedRoute permission={["15"]}><RoleManagement/></ProtectedRoute></Route>
            <Route exact path="/role-management/add-role"><ProtectedRoute permission={["15"]}><AddRole/></ProtectedRoute></Route>
            <Route exact path="/role-management/edit-role/:id"><ProtectedRoute permission={["15"]}><EditRole/></ProtectedRoute></Route>
            <Route exact path="/user-role"><ProtectedRoute permission={["16"]}><UserRole/></ProtectedRoute></Route>
            <Route exact path="/user-role/edit-user-role/:id"><ProtectedRoute permission={["16"]}><EditUserRole/></ProtectedRoute></Route>
            <Route exact path="/user-role/add-user"><ProtectedRoute permission={["16"]}><AddUser/></ProtectedRoute></Route>
            <Route exact path="/seo-keyword" component={KeywordManagement} />
            <Route exact path="/activity/user"><ProtectedRoute permission={["19"]}><UserPage/></ProtectedRoute></Route>
            <Route exact path="/activity/user/:id"><ProtectedRoute permission={["19"]}><Route exact path="/activity/user/:id" component={UserByIdPage} /></ProtectedRoute></Route>
            <Route exact path="/activity/shop"><ProtectedRoute permission={["20"]}><AddUser/></ProtectedRoute></Route>
          </Main>
        </Switch>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <SignIn />
      </UnauthenticatedTemplate>
    </div >
  );
}


export default App;

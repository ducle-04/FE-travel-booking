import UserLayout from "./components/Layout/DefautLayout/UserLayout/UserLayout";
import AdminLayout from "./components/Layout/DefautLayout/AdminLayout/AdminLayout";
import Home from "./pages/User/Home"
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AdminDashboard from "./pages/Admin/Dashboard";
import TravelWebsite from "./pages/User/TravelWebsite";
import ProfilePage from "./pages/User/ProfilePage";
import UserManagement from "./pages/Admin/UserManagement";
import DestinationsPage from "./pages/User/Destinations";
import DestinationManagement from "./pages/Admin/DestinationManagement";
import TourManagement from "./pages/Admin/TourManagement";

const PublicPage = [
    { path: "/", component: Home, layout: UserLayout },
    { path: "/about", component: TravelWebsite, layout: UserLayout },
    { path: "/login", component: Login, layout: null },
    { path: "/register", component: Register, layout: null },
    { path: "/profile", component: ProfilePage, layout: UserLayout },
    { path: "/destinations", component: DestinationsPage, layout: UserLayout },
    { path: "/admin", component: AdminDashboard, layout: AdminLayout },
    { path: "/admin/users", component: UserManagement, layout: AdminLayout },
    { path: "/admin/destinations", component: DestinationManagement, layout: AdminLayout },
    { path: "/admin/tours", component: TourManagement, layout: AdminLayout },
];

const PrivatePage: any[] = [];

export { PublicPage, PrivatePage };

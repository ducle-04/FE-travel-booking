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
import Tour from "./pages/User/Tour";
import Blog from "./pages/User/Blog";
import ContactPage from "./pages/User/ContactPage";
import BlogDetailPage from "./pages/User/BlogDetailPage";
import DestinationManagement from "./pages/Admin/DestinationManagement";
import TourManagement from "./pages/Admin/TourManagement";
import TourCategoryManagement from "./pages/Admin/TourCategoryManagement";
import TourDetailPage from "./pages/Admin/TourDetailPage";
import TourDetailUserPage from "./pages/User/TourDetailUserPage";
import BookingManagement from "./pages/Admin/BookingManagement";
import MyBookingsPage from "./pages/User/MyBookingsPage";
import AdminBlogManagement from "./pages/Admin/AdminBlogManagement";

const PublicPage = [
    { path: "/", component: Home, layout: UserLayout },
    { path: "/about", component: TravelWebsite, layout: UserLayout },
    { path: "/login", component: Login, layout: null },
    { path: "/oauth2/callback", component: Login, layout: null },
    { path: "/register", component: Register, layout: null },
    { path: "/profile", component: ProfilePage, layout: UserLayout },
    { path: "/destinations", component: DestinationsPage, layout: UserLayout },
    { path: "/tours", component: Tour, layout: UserLayout },
    { path: "/blog", component: Blog, layout: UserLayout },
    { path: "/tour/:id", component: TourDetailUserPage, layout: UserLayout },
    { path: "/blog/:id", component: BlogDetailPage, layout: UserLayout },
    { path: "/contact", component: ContactPage, layout: UserLayout },
    { path: "/admin", component: AdminDashboard, layout: AdminLayout },
    { path: "/admin/users", component: UserManagement, layout: AdminLayout },
    { path: "/admin/destinations", component: DestinationManagement, layout: AdminLayout },
    { path: "/admin/tours", component: TourManagement, layout: AdminLayout },
    { path: "/admin/tours/:id", component: TourDetailPage, layout: AdminLayout },
    { path: "/admin/tour-categories", component: TourCategoryManagement, layout: AdminLayout },
    { path: "/admin/bookings", component: BookingManagement, layout: AdminLayout },
    { path: "/admin/blogs", component: AdminBlogManagement, layout: AdminLayout },
    { path: "/my-tours", component: MyBookingsPage, layout: UserLayout },
];

const PrivatePage: any[] = [];

export { PublicPage, PrivatePage };

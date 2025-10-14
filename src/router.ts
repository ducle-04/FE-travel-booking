import UserLayout from "./components/Layout/DefautLayout/UserLayout/UserLayout";
import Home from "./pages/User/Home"
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

const PublicPage = [
    { path: "/", component: Home, layout: UserLayout },
    { path: "/login", component: Login, layout: null },
    { path: "/register", component: Register, layout: null },
];

const PrivatePage: any[] = [];

export { PublicPage, PrivatePage };

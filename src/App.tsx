import { Route, Routes, useLocation } from "react-router-dom";
import { PublicPage } from "./router";
import ScrollToTop from "./components/OtherComponent/ScrollToTop";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatbotWidget from "../src/components/OtherComponent/ChatbotWidget";

function App() {
  const location = useLocation();

  // Danh sách path cần ẩn chatbot
  const hiddenChatbotPaths = [
    "/login",
    "/register",
    "/oauth2/callback",
    "/admin",
  ];

  // Kiểm tra xem có nằm trong danh sách cần ẩn không
  const shouldHideChatbot =
    hiddenChatbotPaths.some(path => location.pathname.startsWith(path));

  return (
    <ThemeProvider>
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <ScrollToTop />

        <Routes>
          {PublicPage.map((page, index) => {
            const Page = page.component;
            const Layout = page.layout;

            return (
              <Route
                key={index}
                path={page.path}
                element={
                  Layout ? (
                    <Layout>
                      <Page />
                    </Layout>
                  ) : (
                    <Page />
                  )
                }
              />
            );
          })}
        </Routes>

        {/* Chỉ hiển thị nếu không nằm trong các trang admin/login/register */}
        {!shouldHideChatbot && <ChatbotWidget />}
      </div>
    </ThemeProvider>
  );
}

export default App;

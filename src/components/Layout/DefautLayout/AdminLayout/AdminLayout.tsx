import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { useTheme } from "../../../../context/ThemeContext"; // ✅ thêm

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const { theme } = useTheme(); // ✅ lấy theme từ context

    const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div
            className={`flex h-screen overflow-hidden transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
                }`}
        >
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />

            {/* Content */}
            <div className="flex flex-col flex-grow min-w-0">
                {/* Header */}
                <Header onToggleSidebar={handleToggleSidebar} />

                {/* Main Content */}
                <main
                    className="flex-grow overflow-y-auto p-6 transition-all duration-300"
                    style={{
                        maxHeight: "calc(100vh - 64px - 50px)",
                    }}
                >
                    <div className="mx-auto w-full">{children}</div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default AdminLayout;

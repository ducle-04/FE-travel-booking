import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

    const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
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
                        maxHeight: "calc(100vh - 64px - 56px)", // trừ Header (64px) + Footer (56px)
                    }}
                >
                    <div className=" mx-auto w-full">{children}</div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default AdminLayout;

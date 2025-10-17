import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="w-full text-center py-3 text-sm text-gray-600 bg-white border-t">
            © 2025 <span className="font-semibold text-gray-800">FoodieHub Admin</span> | Powered by{" "}
            <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                FoodieHub Team
            </span>
        </footer>
    );
};

export default Footer;

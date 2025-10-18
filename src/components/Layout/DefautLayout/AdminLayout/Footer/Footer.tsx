import React from "react";

interface FooterProps {
    isDarkMode?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
    return (
        <footer
            className={`h-12 flex items-center justify-center text-sm border-t transition-colors duration-300
                ${isDarkMode
                    ? "bg-gray-800 border-gray-700 text-gray-400"
                    : "bg-white border-gray-200 text-gray-600"
                }`}
        >
            © 2025{" "}
            <span
                className={`font-semibold mx-1 ${isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
            >
                WonderTrail Admin
            </span>
            | Powered by{" "}
            <span
                className={`font-medium ml-1 cursor-pointer hover:underline ${isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
            >
                WonderTrail Team
            </span>
        </footer>
    );
};

export default Footer;

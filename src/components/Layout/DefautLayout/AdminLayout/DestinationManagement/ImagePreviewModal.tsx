import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../../../../context/ThemeContext';

interface ImagePreviewModalProps {
    isOpen: boolean;
    imageUrl: string | null;
    onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ isOpen, imageUrl, onClose }) => {
    const { theme } = useTheme();

    if (!isOpen || !imageUrl) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${theme === 'dark' ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'}`}>
            <div className={`rounded-2xl max-w-4xl w-full max-h-[90vh] relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-slate-100'}`}
                >
                    <X size={24} />
                </button>
                <img
                    src={imageUrl}
                    alt="Large preview"
                    className="w-full max-h-[80vh] object-contain rounded-2xl"
                />
            </div>
        </div>
    );
};

export default ImagePreviewModal;
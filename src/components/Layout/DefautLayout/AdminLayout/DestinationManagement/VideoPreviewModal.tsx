import React from 'react';
import { X, Maximize2 } from 'lucide-react';

interface Props {
    isOpen: boolean;
    videoUrl: string | null;
    onClose: () => void;
}

const VideoPreviewModal: React.FC<Props> = ({ isOpen, videoUrl, onClose }) => {
    // Click ngoài modal hoặc phím ESC để thoát
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !videoUrl) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={onClose}
        >
            {/* Ngăn click vào video làm đóng modal */}
            <div
                className="relative max-w-6xl w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Nút đóng */}
                <button
                    onClick={onClose}
                    className="absolute -top-14 right-0 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-200 group"
                >
                    <X size={28} className="text-white group-hover:text-red-400 transition" />
                </button>

                {/* Video fullscreen */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <video
                        src={videoUrl}
                        controls
                        autoPlay
                        className="w-full h-auto max-h-[90vh] rounded-2xl"
                        style={{ aspectRatio: '16/9' }}
                        controlsList="nodownload"
                    >
                        Trình duyệt của bạn không hỗ trợ video.
                    </video>

                    {/* Nút fullscreen (tùy trình duyệt) */}
                    <div className="absolute bottom-4 right-4 opacity-0 hover:opacity-100 transition">
                        <button
                            onClick={() => {
                                const video = document.querySelector('video');
                                if (video?.requestFullscreen) {
                                    video.requestFullscreen();
                                }
                            }}
                            className="p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition"
                            title="Toàn màn hình"
                        >
                            <Maximize2 size={24} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Hướng dẫn */}
                <p className="text-center text-white/70 text-sm mt-4">
                    Nhấn <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd> hoặc click bên ngoài để thoát
                </p>
            </div>
        </div>
    );
};

export default VideoPreviewModal;
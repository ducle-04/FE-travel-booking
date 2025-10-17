import { Search } from 'lucide-react';
import { useState } from 'react';
import ImageBackground from "../../../../../assets/images/background/anh3.webp"

export default function TravelBanner() {
    const [keywords, setKeywords] = useState('');
    const [destination, setDestination] = useState('Bất kỳ');
    const [duration, setDuration] = useState('Bất kỳ');

    const handleSearch = () => {
        console.log({ keywords, destination, duration });
    };

    return (
        <section className="relative min-h-screen overflow-hidden" style={{
            backgroundImage: `url(${ImageBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            {/* Overlay mờ */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-md"></div>

            <section className="relative">
                <div className="max-w-7xl mx-auto px-6 py-16 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">

                        {/* Nội dung bên trái */}
                        <div className="z-20 flex flex-col justify-center pr-8">
                            {/* Badge */}
                            <div className="inline-flex items-center bg-cyan-50 rounded-full px-4 py-2 w-fit mb-8">
                                <span className="text-cyan-500 font-medium text-sm">Đặt Tour Với Chúng Tôi!</span>
                            </div>

                            {/* Tiêu đề */}
                            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                                Tìm Điểm Đến <br />
                                Tiếp Theo Để <span className="text-cyan-500">Khám Phá</span>
                            </h1>

                            {/* Mô tả */}
                            <p className="text-gray-600 text-lg mb-3 leading-relaxed">
                                Khám phá những địa điểm tuyệt vời với các ưu đãi độc quyền.
                            </p>
                            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                                Ăn uống, mua sắm, tham quan những nơi thú vị khắp thế giới.
                            </p>

                            {/* Ô tìm kiếm */}
                            <div className="bg-white rounded-2xl p-8 relative z-30 w-full -mb-20 shadow-lg">
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {/* Ô nhập từ khóa */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-800 font-semibold text-sm mb-2">Từ khóa</label>
                                        <input
                                            type="text"
                                            placeholder="Nhập từ khóa tìm kiếm"
                                            value={keywords}
                                            onChange={(e) => setKeywords(e.target.value)}
                                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700 placeholder-gray-400 text-sm"
                                        />
                                    </div>

                                    {/* Dropdown điểm đến */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-800 font-semibold text-sm mb-2">Điểm đến</label>
                                        <select
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700 cursor-pointer appearance-none text-sm"
                                            style={{
                                                backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%23666\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\"/></svg>')",
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 8px center',
                                                backgroundSize: '20px',
                                                paddingRight: '32px'
                                            }}
                                        >
                                            <option>Bất kỳ</option>
                                            <option>Châu Á</option>
                                            <option>Châu Âu</option>
                                            <option>Châu Mỹ</option>
                                            <option>Châu Phi</option>
                                        </select>
                                    </div>

                                    {/* Dropdown thời gian */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-800 font-semibold text-sm mb-2">Thời gian</label>
                                        <select
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700 cursor-pointer appearance-none text-sm"
                                            style={{
                                                backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%23666\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\"/></svg>')",
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 8px center',
                                                backgroundSize: '20px',
                                                paddingRight: '32px'
                                            }}
                                        >
                                            <option>Bất kỳ</option>
                                            <option>3-5 ngày</option>
                                            <option>1 tuần</option>
                                            <option>2 tuần</option>
                                            <option>1 tháng</option>
                                        </select>
                                    </div>

                                    {/* Nút tìm kiếm */}
                                    <div className="flex flex-col justify-end">
                                        <button
                                            onClick={handleSearch}
                                            className="bg-cyan-500 hover:bg-cyan-800 transition-all duration-300 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 h-12 whitespace-nowrap"
                                        >
                                            <Search className="w-5 h-5" />
                                            <span className="hidden sm:inline">Tìm kiếm</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hình ảnh bên phải */}
                        <div className="relative hidden lg:flex justify-end">
                            <img
                                src={ImageBackground}
                                alt="Hồ Núi"
                                className="w-[480px] h-[620px] object-cover rounded-3xl"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}
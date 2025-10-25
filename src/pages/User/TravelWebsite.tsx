import React from "react";
import {
  MapPin,
  Plane,
  Hotel,
  Users,
  Navigation,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ImageBackground from "../../assets/images/background/background5.jpg";
import imgthanhtuu from "../../assets/images/background/thanhtuu_doitac.jpg";

interface Service {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const TravelWebsite: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(200, 200, 200, 0.7), rgba(200, 200, 200, 0.7)), url(${ImageBackground})`,
        }}
      >
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <div className="flex justify-center mb-6">
            <MapPin className="w-16 h-16 text-cyan-500" aria-hidden="true" />
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-gray-900">
            WonderTrail
          </h1>

          <p className="text-2xl md:text-3xl mb-6 font-light italic text-cyan-600">
            🧭 Khám phá thế giới cùng bạn
          </p>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-800">
            Chúng tôi là công ty du lịch chuyên tổ chức các tour trong và ngoài
            nước, mang đến trải nghiệm chân thật và đáng nhớ cho khách hàng.
          </p>

          <a
            href="#services"
            className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg 
                        hover:scale-105 transition-transform duration-300"
            aria-label="Đặt tour du lịch ngay"
          >
            Đặt Tour Ngay
          </a>
        </div>

        {/* Chevron icon */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/90" aria-hidden="true" />
        </div>
      </section>

      {/* Vision - Mission - Values */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            🗺️ Tầm nhìn - Sứ mệnh - Giá trị cốt lõi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">
                Tầm nhìn
              </h3>
              <p className="text-gray-700">
                Trở thành nền tảng đặt tour hàng đầu Việt Nam, kết nối hàng
                triệu du khách với những trải nghiệm tuyệt vời.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Sứ mệnh</h3>
              <p className="text-gray-700">
                Giúp mọi người du lịch dễ dàng, an toàn và tiết kiệm, biến mỗi
                chuyến đi thành một ký ức vô tận.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">
                Giá trị cốt lõi
              </h3>
              <p className="text-gray-700">
                Trung thực • Chuyên nghiệp • Tận tâm • Sáng tạo • Tiên phong
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            🏖️ Dịch vụ chính của chúng tôi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {(
              [
                {
                  icon: MapPin,
                  title: "Tour Du lịch Trong Nước",
                  desc: "Khám phá vẻ đẹp thiên nhiên từ Hà Nội đến TP.HCM với giá cạnh tranh",
                },
                {
                  icon: Plane,
                  title: "Tour Nước Ngoài",
                  desc: "Chuyến đi thế giới, từ Thái Lan đến châu Âu, với hướng dẫn viên chuyên nghiệp",
                },
                {
                  icon: Hotel,
                  title: "Đặt Phòng Khách Sạn",
                  desc: "Lựa chọn từ 3 sao đến 5 sao, đặt ngay và nhận ưu đãi độc quyền",
                },
                {
                  icon: Plane,
                  title: "Vé Máy Bay",
                  desc: "Giá tốt nhất cho các hãng bay nội và quốc tế, đặt linh hoạt",
                },
                {
                  icon: Navigation,
                  title: "Combo Du Lịch",
                  desc: "Gói combo toàn diện: vé máy bay + khách sạn + tour giá rẻ",
                },
                {
                  icon: Users,
                  title: "Tour Riêng Theo Yêu Cầu",
                  desc: "Tổ chức tour tùy chỉnh theo nhu cầu, ngân sách và thời gian của bạn",
                },
              ] as Service[]
            ).map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg transition transform hover:scale-105"
                >
                  <Icon
                    className="w-12 h-12 text-blue-600 mb-4"
                    aria-hidden="true"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-700">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        id="team"
        className="py-20  to-white from-blue-50 bg-gradient-to-b px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            👥 Đội ngũ tuyệt vời của chúng tôi
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            "Niềm vui của khách hàng là thành công của chúng tôi"
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: "Nguyễn Văn A",
                role: "Hướng Dẫn Viên",
                exp: "15 năm kinh nghiệm",
              },
              {
                name: "Trần Thị B",
                role: "Tư Vấn Du Lịch",
                exp: "10 năm kinh nghiệm",
              },
              {
                name: "Lê Văn C",
                role: "Hướng Dẫn Viên",
                exp: "12 năm kinh nghiệm",
              },
              {
                name: "Phạm Thị D",
                role: "Quản Lý Tour",
                exp: "8 năm kinh nghiệm",
              },
            ].map((member, idx) => (
              <div key={idx} className="bg-white rounded-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-b from-blue-400 to-blue-200 flex items-center justify-center">
                  <Users className="w-20 h-20 text-white" aria-hidden="true" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold">{member.role}</p>
                  <p className="text-sm text-gray-600 mt-2">{member.exp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section
        id="achievements"
        // className="py-20 bg-white px-4"
        className="relative h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(200, 200, 200, 0.7), rgba(200, 200, 200, 0.7)), url("${imgthanhtuu}")`,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            📸 Thành tựu & Đối tác
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { number: "10+", label: "Năm Kinh Nghiệm" },
              { number: "50,000+", label: "Khách Hàng Hài Lòng" },
              { number: "300+", label: "Tour Mỗi Năm" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </p>
                <p className="text-xl text-gray-700">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
              Đối Tác Tin Tưởng
            </h3>
            {/* <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center justify-items-center">
              {[
                "Vietnam Airlines",
                "Agoda",
                "Booking.com",
                "Expedia",
                "TripAdvisor",
              ].map((partner, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 px-4 py-3 rounded-lg text-center font-semibold text-gray-700 w-full"
                >
                  {partner}
                </div>
              ))}
            </div> */}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center justify-items-center">
              {[
                "Vietnam Airlines",
                "Agoda",
                "Booking.com",
                "Expedia",
                "TripAdvisor",
              ].map((partner, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 text-black-700 font-semibold px-4 py-3 rounded-lg w-full text-center shadow-md hover:bg-blue-100 hover:text-gray-500 transition"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      {/* <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            🏆 Giấy phép & Cam kết chất lượng
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-500 bg-opacity-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Giấy Phép Kinh Doanh</h3>
              <p className="text-lg">
                Giấy phép kinh doanh du lịch: <strong>0123456789</strong>
              </p>
              <p className="text-lg mt-2">
                Mã số doanh nghiệp: <strong>0123456789</strong>
              </p>
            </div>
            <div className="bg-blue-500 bg-opacity-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Cam Kết</h3>
              <ul className="space-y-2 text-lg">
                <li>✓ Chất lượng dịch vụ tuyệt vời</li>
                <li>✓ An toàn tuyệt đối cho khách hàng</li>
                <li>✓ Minh bạch giá cả, không phí ẩn</li>
                <li>✓ Hỗ trợ 24/7 mọi lúc</li>
              </ul>
            </div>
          </div>
        </div>
      </section> */}

      <section className="py-20 bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-700">
            🏆 Giấy phép & Cam kết chất lượng
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Giấy Phép */}
            <div className="bg-white rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold mb-4 text-blue-700">
                Giấy Phép Kinh Doanh
              </h3>
              <p className="text-lg text-gray-700">
                Giấy phép kinh doanh du lịch:{" "}
                <strong className="text-blue-600">0123456789</strong>
              </p>
              <p className="text-lg mt-2 text-gray-700">
                Mã số doanh nghiệp:{" "}
                <strong className="text-blue-600">0123456789</strong>
              </p>
            </div>

            {/* Cam Kết */}
            <div className="bg-white rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold mb-4 text-blue-700">Cam Kết</h3>
              <ul className="space-y-2 text-lg text-gray-700">
                <li>✓ Chất lượng dịch vụ tuyệt vời</li>
                <li>✓ An toàn tuyệt đối cho khách hàng</li>
                <li>✓ Minh bạch giá cả, không phí ẩn</li>
                <li>✓ Hỗ trợ 24/7 mọi lúc</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400",
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
              "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400",
              "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400",
            ].map((img, idx) => (
              <div
                key={idx}
                className="h-64 rounded-lg overflow-hidden transition"
              >
                <img
                  src={img}
                  alt={`Hình ảnh điểm đến du lịch ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelWebsite;

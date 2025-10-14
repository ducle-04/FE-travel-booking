import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';

interface UserLayoutProps {
    children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    // const [isPopUp, setIsPopUp] = useState<boolean>(false);

    return (
        <div className='font-Montserrat'>
            <Header />
            <div className='min-h-screen'>
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default UserLayout;

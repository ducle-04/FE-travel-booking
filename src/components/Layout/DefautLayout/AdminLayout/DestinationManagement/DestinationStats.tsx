import React from 'react';
import { useTheme } from '../../../../../context/ThemeContext';

interface Destination {
    id: string;
    name: string;
    region: 'Bắc' | 'Trung' | 'Nam';
    description: string;
    imageUrl: string;
    toursCount: number;
    status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
}

interface DestinationStatsProps {
    destinations: Destination[];
}

const DestinationStats: React.FC<DestinationStatsProps> = ({ destinations }) => {
    const { theme } = useTheme();

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`rounded-2xl p-5 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Tổng điểm đến</div>
                <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>{destinations.filter(d => d.status !== 'DELETED').length}</div>
            </div>
            <div className={`rounded-2xl p-5 border ${theme === 'dark' ? 'bg-gray-800 border-blue-700' : 'bg-white border-blue-200'}`}>
                <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Miền Bắc</div>
                <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>{destinations.filter(d => d.region === 'Bắc' && d.status !== 'DELETED').length}</div>
            </div>
            <div className={`rounded-2xl p-5 border ${theme === 'dark' ? 'bg-gray-800 border-amber-700' : 'bg-white border-amber-200'}`}>
                <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>Miền Trung</div>
                <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`}>{destinations.filter(d => d.region === 'Trung' && d.status !== 'DELETED').length}</div>
            </div>
            <div className={`rounded-2xl p-5 border ${theme === 'dark' ? 'bg-gray-800 border-emerald-700' : 'bg-white border-emerald-200'}`}>
                <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Miền Nam</div>
                <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>{destinations.filter(d => d.region === 'Nam' && d.status !== 'DELETED').length}</div>
            </div>
        </div>
    );
};

export default DestinationStats;
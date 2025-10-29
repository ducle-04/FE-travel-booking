import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDown, MapPin, Clock } from 'lucide-react';

interface ItineraryItem {
    day: string;
    schedule: string;
}

const parseItinerary = (raw: string): ItineraryItem[] => {
    if (!raw) return [];

    // 1. HTML: <p><strong>Ngày 1:</strong> Nội dung...</p>
    const htmlMatches = Array.from(raw.matchAll(/<p[^>]*><strong>(Ngày\s*\d+:)<\/strong>\s*(.*?)(?=<\/p>|$)/gi));
    if (htmlMatches.length > 0) {
        return htmlMatches.map(m => ({
            day: m[1].trim(),
            schedule: m[2].replace(/<\/?[^>]+(>|$)/g, '').trim()
        }));
    }

    // 2. Plain text: Ngày 1: Nội dung...
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    const result: ItineraryItem[] = [];
    let current: ItineraryItem | null = null;

    for (const line of lines) {
        if (/^Ngày\s*\d+:/.test(line)) {
            if (current) result.push(current);
            const [day, ...rest] = line.split(':');
            current = { day: day.trim(), schedule: rest.join(':').trim() };
        } else if (current) {
            current.schedule += '\n' + line;
        }
    }
    if (current) result.push(current);
    return result;
};

interface ItineraryAccordionProps {
    itineraryHtml: string;
}

const ItineraryAccordion: React.FC<ItineraryAccordionProps> = ({ itineraryHtml }) => {
    const items = parseItinerary(itineraryHtml);

    if (items.length === 0) {
        return (
            <div className="flex items-center justify-center py-12 px-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                <div className="text-center">
                    <MapPin className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                    <p className="text-sm font-medium text-gray-500">
                        Chưa có lịch trình chi tiết
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <Disclosure key={index} defaultOpen={index === 0}>
                    {({ open }) => (
                        <div
                            className={`overflow-hidden rounded-xl border transition-all duration-300 ${open
                                    ? 'border-blue-400 shadow-lg shadow-blue-400/20'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <Disclosure.Button
                                className={`flex w-full items-center justify-between px-6 py-4 text-left font-semibold transition-all duration-300 ${open
                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                                        : 'bg-white text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${open
                                                ? 'bg-white/20 backdrop-blur-sm'
                                                : 'bg-blue-50 text-blue-600'
                                            }`}
                                    >
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="text-lg">{item.day.replace(':', '')}</span>
                                        {open && (
                                            <div className="mt-0.5 text-xs font-normal text-blue-100">
                                                Xem chi tiết lịch trình
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className={`rounded-full p-2 transition-all duration-300 ${open ? 'bg-white/20 rotate-180' : 'bg-gray-100'
                                        }`}
                                >
                                    <ChevronDown className="h-5 w-5" />
                                </div>
                            </Disclosure.Button>

                            <Disclosure.Panel className="px-6 py-5 bg-gray-50/50">
                                <div className="space-y-3 text-sm leading-relaxed text-gray-700">
                                    {item.schedule.split('\n').map((line, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="flex-shrink-0 mt-1.5">
                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            </div>
                                            <p className="flex-1">{line}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Timeline connector cho item không phải cuối */}
                                {index < items.length - 1 && (
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="h-px flex-1 bg-gray-300" />
                                        <span className="text-xs font-medium text-gray-400">
                                            Tiếp theo
                                        </span>
                                        <div className="h-px flex-1 bg-gray-300" />
                                    </div>
                                )}
                            </Disclosure.Panel>
                        </div>
                    )}
                </Disclosure>
            ))}

            {/* Summary */}
            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-blue-50/50 px-6 py-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                    Tổng số: {items.length} ngày trong hành trình
                </span>
            </div>
        </div>
    );
};

export default ItineraryAccordion;
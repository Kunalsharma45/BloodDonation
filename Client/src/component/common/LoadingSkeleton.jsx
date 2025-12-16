import React from 'react';

const LoadingSkeleton = ({ className = '', height = 'h-4', width = 'w-full', count = 1 }) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className={`
                bg-gray-200 animate-pulse rounded 
                ${height} ${width}
            `}
                />
            ))}
        </div>
    );
};

export default LoadingSkeleton;

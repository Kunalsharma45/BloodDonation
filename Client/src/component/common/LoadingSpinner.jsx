import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'red', className = '' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-3',
        xl: 'h-16 w-16 border-4'
    };

    const colorClasses = {
        red: 'border-red-600',
        blue: 'border-blue-600',
        white: 'border-white',
        gray: 'border-gray-400'
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div
                className={`
                animate-spin rounded-full 
                border-t-transparent 
                ${sizeClasses[size] || sizeClasses.md} 
                ${colorClasses[color] || colorClasses.red}
            `}
            />
        </div>
    );
};

export default LoadingSpinner;

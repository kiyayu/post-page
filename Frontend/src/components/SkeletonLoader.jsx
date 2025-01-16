// components/SkeletonLoader.js
import React from 'react';

const SkeletonLoader = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="animate-pulse">
                {/* Hero Section Skeleton */}
                <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8"></div>

                {/* Features Section Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white dark:bg-gray-800 p-8 rounded-xl">
                            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                            <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                            <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded mx-auto"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;
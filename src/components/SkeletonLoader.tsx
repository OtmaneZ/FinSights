import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'chart' | 'kpi';
  count?: number;
}

export default function SkeletonLoader({ variant = 'text', count = 1 }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'kpi':
        return (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="h-5 bg-slate-200 rounded w-32"></div>
              <div className="h-6 w-6 bg-slate-200 rounded"></div>
            </div>
            <div className="h-8 bg-slate-300 rounded w-24 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-20"></div>
          </div>
        );

      case 'card':
        return (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-4/6"></div>
            </div>
          </div>
        );

      case 'chart':
        return (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-40 mb-6"></div>
            <div className="space-y-4">
              <div className="flex items-end space-x-2" style={{ height: '200px' }}>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-slate-200 rounded-t"
                    style={{ height: `${Math.random() * 60 + 40}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'text':
      default:
        return (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-11/12"></div>
          </div>
        );
    }
  };

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
}

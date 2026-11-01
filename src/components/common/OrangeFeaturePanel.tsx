import React from 'react';

interface OrangeFeaturePanelProps {
  title: string;
  badge?: string;
  subtitle?: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
  className?: string;
}

export const OrangeFeaturePanel: React.FC<OrangeFeaturePanelProps> = ({
  title,
  badge,
  subtitle,
  children,
  footerActions,
  className = '',
}) => {
  return (
    <aside
      className={`w-full lg:w-[340px] xl:w-[380px] shrink-0 bg-[#EE6123] text-white rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-[0_12px_36px_rgba(238,97,35,0.24)] transition-all ${className}`}
      aria-label={title}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
              {title}
            </h2>
            {subtitle && (
              <p className="text-white/80 text-xs mt-1 leading-relaxed">{subtitle}</p>
            )}
          </div>
          {badge && (
            <span className="shrink-0 px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-medium backdrop-blur-sm">
              {badge}
            </span>
          )}
        </div>

        {/* Content body */}
        <div className="mt-4 space-y-4 text-white text-xs sm:text-sm">{children}</div>
      </div>

      {/* Optional sticky or footer action bar */}
      {footerActions && (
        <div className="mt-6 pt-4 border-t border-white/20 flex flex-col gap-2">
          {footerActions}
        </div>
      )}
    </aside>
  );
};

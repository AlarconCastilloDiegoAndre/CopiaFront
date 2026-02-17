import React from 'react';

interface IconBoxProps {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  bgColor?: string;
  iconColor?: string;
  rounded?: string;
}

export const IconBox = (
  {
    icon,
    size = 'md',
    bgColor = 'bg-main-color',
    iconColor = 'text-white',
    rounded = 'rounded-lg',
  }: IconBoxProps) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`${sizes[size]} ${bgColor} ${rounded} flex items-center justify-center flex-shrink-0`}>
      <div className={iconColor}>
        {icon}
      </div>
    </div>
  );
};
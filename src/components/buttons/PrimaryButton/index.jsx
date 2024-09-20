import React from 'react';

const PrimaryButton = ({ className, children, ...props }) => {
  return (
    <button
      className={`h-[39px] px-[22px] py-2.5 bg-[#ad974f] justify-center items-center gap-2.5 inline-flex text-white text-base font-bold tracking-widest hover:border-2 hover:border-[#dab674] hover:px-[20px] hover:bg-transparent hover:text-[#dab674] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
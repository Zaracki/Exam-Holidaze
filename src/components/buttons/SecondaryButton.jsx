const SecondaryButton = ({ className, children, ...props }) => {
  return (
    <button
      className={`h-[39px] px-[22px] py-2.5 bg-transperant justify-center items-center gap-2.5 inline-flex text-[#dab674] text-base font-bold tracking-widest border-2 border-[#ad974f] px-[20px] hover:bg-[#ad974f] hover:text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
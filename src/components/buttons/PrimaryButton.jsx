const PrimaryButton = ({ className, children, ...props }) => {
  return (
    <button
      className={`h-[39px] px-[22px] py-2.5 bg-yellow-500 justify-center items-center gap-2.5 inline-flex text-zinc-900 text-base font-bold tracking-widest hover:border-2 hover:border-yellow-500 hover:px-[20px] hover:bg-transparent hover:text-yellow-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
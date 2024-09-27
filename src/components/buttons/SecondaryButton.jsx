const SecondaryButton = ({ className, children, ...props }) => {
  return (
    <button
      className={`h-[39px] px-[22px] py-2.5 bg-transperant justify-center items-center gap-2.5 inline-flex text-yellow-500 text-base font-bold tracking-widest border-2 border-yellow-500 px-[20px] hover:bg-yellow-500 hover:text-zinc-900 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
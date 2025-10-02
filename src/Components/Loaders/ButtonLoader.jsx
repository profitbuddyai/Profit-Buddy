export default function ButtonLoader({ className = '' }) {
  return (
    <div className={`flex items-center justify-center text-backgroundC ${className}`}>
      <div className="animate-spin  transition-all w-[16px] h-[16px] border-[2px] border-primary border-b-transparent rounded-full  ">
      </div>
    </div>
  );
}
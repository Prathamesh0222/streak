import { Button } from "./ui/button";

export const Hero = () => {
  return (
    <div className="relative p-4 mx-3 rounded-xl border border-gray-200 h-full overflow-hidden bg-white">
      <div
        className="absolute inset-0 h-full w-full bg-[#ffffff] bg-[radial-gradient(#00000033_1px,#ffffff_1px)] bg-[size:10px_10px] opacity-50"
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Think, plan, and track
          <span className="block mt-2">all in one place</span>
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Efficiently manage your habits and boost productivity.
        </p>
        <Button className="mt-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-sm hover:shadow-md transition-all duration-200 font-semibold">
          Get Started
        </Button>
      </div>
    </div>
  );
};

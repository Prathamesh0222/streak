import { Button } from "./ui/button";

export const Hero = () => {
  return (
    <div className="relative p-4 mx-3 rounded-xl border h-full overflow-hidden">
      <div
        className="absolute inset-0 h-full w-full dark:bg-[#000000] dark:bg-[radial-gradient(#ffffff33_1px,#00091d_1px)]
     dark:bg-[size:10px_10px] bg-[#ffffff] bg-[radial-gradient(#00000033_1px,#ffffff_1px)] bg-[size:10px_10px] opacity-50"
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Think, plan, and track
          <span className="block mt-2">all in one place</span>
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Efficiently manage your habits and boost productivity.
        </p>
        <Button className="mt-3">Get Started</Button>
      </div>
    </div>
  );
};

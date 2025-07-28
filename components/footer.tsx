import { Github, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="p-4 flex justify-between w-full max-w-7xl mx-auto">
      <p className="font-semibold">Designed & Developed By Prathamesh</p>
      <div className="flex gap-2">
        <Github />
        <Linkedin />
      </div>
    </footer>
  );
};

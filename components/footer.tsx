import { Github, Linkedin } from "lucide-react";

export const Footer = () => {
  const LINKEDIN = process.env.LINKEDIN_URL;
  const GITHUB = process.env.GITHUB_URL;

  return (
    <footer className="p-3 flex justify-between w-full max-w-7xl mx-auto items-center">
      <p className="font-semibold">Designed & Developed By Prathamesh</p>
      <div className="flex gap-2">
        <a
          className="p-2 border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
          href={GITHUB}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit GitHub profile"
        >
          <Github className="w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors" />
        </a>
        <a
          className="p-2 border border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
          href={LINKEDIN}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit LinkedIn profile"
        >
          <Linkedin className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors" />
        </a>
      </div>
    </footer>
  );
};

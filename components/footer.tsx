import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  const LINKEDIN = process.env.LINKEDIN_URL;
  const GITHUB = process.env.GITHUB_URL;

  return (
    <footer className="p-3 flex justify-between w-full max-w-7xl mx-auto items-center border-x">
      <p className="font-semibold text-muted-foreground">
        Designed & Developed By Prathamesh
      </p>
      <div className="flex gap-2">
        <Link
          className="p-2 rounded-full hover:bg-red-500 transition-all duration-200"
          href={GITHUB || ""}
          aria-label="Visit GitHub profile"
        >
          <Github className="w-5 h-5" />
        </Link>
        <Link
          className="p-2 rounded-full hover:bg-red-500 transition-all duration-200"
          href={LINKEDIN || ""}
          aria-label="Visit LinkedIn profile"
        >
          <Linkedin className="w-5 h-5 " />
        </Link>
      </div>
    </footer>
  );
};

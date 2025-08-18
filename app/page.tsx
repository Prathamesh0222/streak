import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-white via-background to-red-500/75 dark:from-red-900/50 dark:via-background dark:to-red-900/50">
      <div className="max-w-7xl mx-auto h-screen flex flex-col ">
        <Header />
        <main className="flex-1">
          <Hero />
        </main>
        <Footer />
      </div>
    </div>
  );
}

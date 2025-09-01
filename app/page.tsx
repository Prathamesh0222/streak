import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <div>
      <div className="h-screen flex flex-col">
        <div className="border-b w-full">
          <Header />
        </div>
        <div className="flex-1">
          <Hero />
        </div>
        <div className="border-t w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
}

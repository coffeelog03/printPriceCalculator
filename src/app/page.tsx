import PrintCalculator from "@/components/print-calculator";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <PrintCalculator />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} PrintPro Calculator. Đã đăng ký bản quyền.
      </footer>
      <script src="https://messenger.svc.chative.io/static/v1.0/channels/s8654ea6a-ace4-4c88-907f-069c5a9a813b/messenger.js?mode=livechat" defer="defer"></script>
    </div>
  );
}

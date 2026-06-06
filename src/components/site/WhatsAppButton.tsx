import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

const HREF =
  "https://wa.me/905414043660?text=" +
  encodeURIComponent("Merhaba, web siteniz üzerinden ulaşıyorum, bir sorum olacaktı.");

export function WhatsAppButton() {
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-end gap-2 sm:bottom-6 sm:right-6">
      {showBubble && (
        <div className="relative hidden animate-bounce-slow rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-xl sm:block">
          Sormak İstediğiniz Bir Şey Var mıydı?
          <button
            aria-label="Kapat"
            onClick={() => setShowBubble(false)}
            className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-muted text-[10px] text-muted-foreground hover:bg-foreground hover:text-background"
          >
            ×
          </button>
          <span className="absolute -right-1.5 bottom-3 h-3 w-3 rotate-45 border-b border-r border-border bg-background" />
        </div>
      )}
      <a
        href={HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişime geçin"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/60 sm:h-16 sm:w-16"
      >
        <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.2} />
      </a>
    </div>
  );
}

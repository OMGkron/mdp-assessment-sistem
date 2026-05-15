import { trpc } from "@/lib/trpc";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, User, RefreshCw, ChevronDown } from "lucide-react";
import { Streamdown } from "streamdown";
import { COMPETENCIES } from "../../../shared/competencies";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_STARTS = [
  "Bagaimana cara menilai kompetensi Kepemimpinan?",
  "Apa perbedaan level 3 dan level 4 untuk Pemikiran Strategis?",
  "Bagaimana cara menggunakan kerangka SBI dalam penilaian?",
  "Berikan contoh perilaku untuk Kecerdasan Emosional level 5",
  "Apa yang harus saya perhatikan dalam Observasi Perilaku?",
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Halo! Saya adalah **Asisten Penilaian Kompetensi MDP** 👋

Saya siap membantu Anda dalam proses penilaian kompetensi Program Pengembangan Manajemen (MDP). Saya dapat membantu Anda:

- **Memahami 6 kompetensi inti** dan indikator perilakunya
- **Membedakan level 1–5** untuk setiap kompetensi
- **Menggunakan kerangka SBI** (Situasi-Perilaku-Dampak) dalam penilaian
- **Memandu proses penilaian** secara langkah demi langkah
- **Memberikan contoh perilaku** konkret untuk setiap level

Apa yang ingin Anda ketahui hari ini?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedParticipantId, setSelectedParticipantId] = useState<number | undefined>();
  const [selectedType, setSelectedType] = useState<"self" | "observation" | undefined>();
  const [selectedCompetency, setSelectedCompetency] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: participants } = trpc.participants.list.useQuery();
  const sendMessage = trpc.chat.message.useMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (content?: string) => {
    const text = content ?? input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMessage].map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: String(m.content),
      }));

      const response = await sendMessage.mutateAsync({
        messages: allMessages,
        participantId: selectedParticipantId,
        assessmentType: selectedType,
        currentCompetency: selectedCompetency,
      });

      const content = typeof response.content === "string" ? response.content : "Maaf, terjadi kesalahan.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant" as const, content },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: `Percakapan baru dimulai. Saya siap membantu Anda dengan penilaian kompetensi MDP. Apa yang ingin Anda ketahui?`,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">Asisten Penilaian MDP</h1>
            <p className="text-xs text-muted-foreground">Panduan Penilaian Kompetensi Berbasis AI</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2 text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      {/* Context selectors */}
      <div className="border-b border-border bg-muted/30 px-6 py-3 flex flex-wrap gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Konteks:</span>
        </div>
        <select
          value={selectedParticipantId ?? ""}
          onChange={(e) => setSelectedParticipantId(e.target.value ? parseInt(e.target.value) : undefined)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          <option value="">Semua Peserta</option>
          {participants?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.fullName}
            </option>
          ))}
        </select>
        <select
          value={selectedType ?? ""}
          onChange={(e) => setSelectedType(e.target.value as any || undefined)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          <option value="">Semua Jenis</option>
          <option value="self">Self-Assessment</option>
          <option value="observation">Observasi Perilaku</option>
        </select>
        <select
          value={selectedCompetency ?? ""}
          onChange={(e) => setSelectedCompetency(e.target.value || undefined)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          <option value="">Semua Kompetensi</option>
          {COMPETENCIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-primary" : "bg-muted border border-border"
              }`}
            >
              {msg.role === "user" ? (
                <User className="h-4 w-4 text-primary-foreground" />
              ) : (
                <Bot className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div
              className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"
              }`}
            >
              {msg.role === "assistant" ? (
                <Streamdown className="prose prose-sm max-w-none text-foreground [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mt-1">
                  {msg.content}
                </Streamdown>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="chat-bubble-bot px-4 py-3">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick starts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {QUICK_STARTS.map((qs) => (
            <button
              key={qs}
              onClick={() => handleSend(qs)}
              className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              {qs}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border bg-card px-4 py-4 shrink-0">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pertanyaan Anda tentang penilaian kompetensi... (Enter untuk kirim)"
            className="resize-none text-sm min-h-[44px] max-h-32 flex-1"
            rows={1}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-11 w-11 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Asisten ini khusus untuk panduan penilaian kompetensi MDP
        </p>
      </div>
    </div>
  );
}

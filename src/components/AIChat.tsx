import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { langToSpeech } from '@/data/translations';
import { quickChatQuestions } from '@/data/appData';
import { chatService } from '@/services/chatService';

interface Message { id: number; role: 'ai' | 'user'; content: string; }

export default function AIChat() {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'ai', content: 'Namaskar! 🙏 I\'m your AI farming assistant. Ask me about pest control, crop care, weather, market prices, or government schemes.\n\nआप हिंदी में भी पूछ सकते हैं!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const speak = useCallback((text: string) => {
    const clean = text.replace(/\*\*/g, '').replace(/[•→🌾🌸💰🌧️🌱🍚💡⚠️✅📅]/g, '');
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = langToSpeech[lang] || 'en-US';
    speechSynthesis.speak(u);
  }, [lang]);

  const sendMessage = async (text?: string) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: q }]);
    setLoading(true);

    try {
      // ── REAL API CALL ──────────────────────────────────────────────
      const reply = await chatService.sendMessage(q);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: reply }]);
      if (autoSpeak) speak(reply);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: 'Sorry, I could not connect to the server. Please check your backend is running on port 8081.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = langToSpeech[lang] || 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false); };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  };

  const formatMsg = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');

  return (
    <section id="chat" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-glow" /> AI Assistant
          </span>
          <h2 className="text-3xl font-display font-bold text-foreground">{t.aiChat}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t.quickQuestions}</p>
            {quickChatQuestions.map(q => (
              <button key={q.text} onClick={() => sendMessage(q.text)}
                className="w-full text-left glass-card p-3 rounded-xl text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-all">
                <span className="text-lg">{q.icon}</span>{q.text}
              </button>
            ))}
          </div>

          <div className="md:col-span-2">
            <div className="glass rounded-2xl flex flex-col h-[520px] overflow-hidden">
              <div className="p-4 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">🌾</div>
                  <div>
                    <div className="text-sm font-bold text-foreground">HaritBandhu AI</div>
                    <div className="text-xs text-primary flex items-center gap-1"><span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /> Online</div>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={autoSpeak} onChange={e => setAutoSpeak(e.target.checked)} className="accent-primary" />
                  Auto 🔊
                </label>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
                    <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs ${msg.role === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      {msg.role === 'ai' ? '🌾' : '👨‍🌾'}
                    </div>
                    <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm leading-relaxed ${msg.role === 'ai' ? 'bg-secondary/50 text-foreground' : 'bg-primary/20 text-foreground border border-primary/30'}`}>
                      <div dangerouslySetInnerHTML={{ __html: formatMsg(msg.content) }} />
                      {msg.role === 'ai' && (
                        <button onClick={() => speak(msg.content)} className="mt-1 text-xs text-primary hover:underline">🔊 Listen</button>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-xs text-primary-foreground">🌾</div>
                    <div className="bg-secondary/50 px-4 py-3 rounded-xl flex gap-1">
                      {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <div className="p-3 border-t border-border/30 flex gap-2">
                <button onClick={startListening}
                  className={`px-3 rounded-xl text-lg transition-all ${listening ? 'bg-destructive/20 text-destructive animate-pulse' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                  🎤
                </button>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder={t.askQuestion}
                  className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted-foreground/50" />
                <button onClick={() => sendMessage()} disabled={loading} className="bg-primary text-primary-foreground font-bold px-5 rounded-xl text-sm hover:opacity-90 disabled:opacity-50">{t.send}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

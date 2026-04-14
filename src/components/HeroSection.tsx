// import { useLanguage } from '@/contexts/LanguageContext';
// import heroBg from '@/assets/hero-bg.jpg';

// export default function HeroSection() {
//   const { t } = useLanguage();

//   return (
//     <section className="relative overflow-hidden py-20 px-4">
//       <div className="absolute inset-0 opacity-20">
//         <img src={heroBg} alt="" className="w-full h-full object-cover" />
//       </div>
//       <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
//         <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
//           <span className="text-green-grad">HaritBandhu</span>
//         </h1>
//         <p className="text-xl md:text-2xl text-foreground/80 font-light mb-3">{t.heroTitle}</p>
//         <p className="text-muted-foreground max-w-xl mx-auto mb-8">{t.heroSubtitle}</p>
//         <div className="flex flex-wrap justify-center gap-3">
//           {['🌾 Pest Detection', '🤖 AI Chat', '📊 Market Prices', '🌤 Weather', '🏛 Schemes', '🧪 Soil Health'].map(item => (
//             <span key={item} className="bg-primary/10 border border-primary/30 text-primary text-sm px-4 py-2 rounded-full">{item}</span>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }





import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import heroBg from '@/assets/hero-bg.jpg';
import phoneMockup from '@/assets/phone-mockup.png'; // Add your phone mockup image

export default function HeroSection() {
  const { t } = useLanguage();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  // Rotating tips for the phone screen
  const rotatingTips = [
    { icon: '🐛', title: 'Aphids Detected', confidence: '87%', treatment: 'Neem oil spray 5mL/L', color: 'from-red-500 to-orange-500' },
    { icon: '🌾', title: 'Yellow Leaves', confidence: '92%', treatment: 'Apply urea at 20kg/acre', color: 'from-yellow-500 to-amber-500' },
    { icon: '🦠', title: 'Leaf Rust', confidence: '78%', treatment: 'Fungicide spray recommended', color: 'from-brown-500 to-orange-600' },
    { icon: '🌱', title: 'Healthy Crop', confidence: '96%', treatment: 'Continue current care', color: 'from-green-500 to-emerald-500' },
  ];
  
  const weatherAlerts = [
    { day: 'Today', condition: '🌧️ Heavy Rain', temp: '22°C', alert: 'High' },
    { day: 'Wed', condition: '⛈️ Thunderstorm', temp: '20°C', alert: 'Severe' },
    { day: 'Thu', condition: '☀️ Sunny', temp: '28°C', alert: 'Low' },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTipIndex((prev) => (prev + 1) % rotatingTips.length);
        setIsVisible(true);
      }, 300);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [rotatingTips.length]);
  
  const currentTip = rotatingTips[currentTipIndex];
  
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center px-4 py-12">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOutDown {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(20px); }
        }
        
        @keyframes floatPhone {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-12px) translateX(8px) rotate(2deg);
          }
          50% {
            transform: translateY(-6px) translateX(-5px) rotate(-2deg);
          }
          75% {
            transform: translateY(8px) translateX(5px) rotate(1deg);
          }
        }
        
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.02); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes scanLine {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
        }
        
        .float-phone {
          animation: floatPhone 4s ease-in-out infinite;
        }
        
        .float-icon {
          animation: floatIcon 6s ease-in-out infinite;
        }
        
        .glow-pulse {
          animation: pulseGlow 3s ease-in-out infinite;
        }
        
        .shimmer-text {
          background: linear-gradient(90deg, #22c55e, #15803d, #22c55e);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
        
        .slide-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }
        
        .slide-right {
          animation: slideInRight 0.6s ease-out forwards;
        }
        
        .cursor-blink::after {
          content: '|';
          animation: blinkCursor 1s step-end infinite;
          margin-left: 2px;
        }
        
        .scan-effect {
          position: relative;
          overflow: hidden;
        }
        
        .scan-effect::before {
          content: '';
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #22c55e, #22c55e, transparent);
          animation: scanLine 2s linear infinite;
          pointer-events: none;
        }
        
        .phone-screen {
          background: linear-gradient(145deg, #0a0a0a, #1a1a2e);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 8px rgba(34, 197, 94, 0.1);
        }
        
        .feature-chip {
          transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        
        .feature-chip:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.3);
        }
        
        .typing-text {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid #22c55e;
          animation: blinkCursor 0.8s step-end infinite;
        }
      `}</style>
      
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="Farm Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 to-transparent" />
      </div>
      
      {/* Floating background icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🌾', '🚜', '🌱', '☀️', '💧', '🍚', '🌸', '🐛', '🦋', '🌽'].map((icon, idx) => (
          <div
            key={idx}
            className={`absolute text-2xl md:text-3xl opacity-20 float-icon`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${idx * 0.5}s`,
              animationDuration: `${5 + idx * 1.5}s`,
            }}
          >
            {icon}
          </div>
        ))}
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-4 py-1.5 text-xs font-bold text-green-400 uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                AI-Powered Agricultural Assistant
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="shimmer-text">Smart Farming</span>
              <br />
              <span className="text-white">with AI & Technology</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Detect pests instantly, get real-time weather alerts, track market prices, 
              and receive expert farming advice — all in your local language.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-500/25 flex items-center gap-2">
                📸 Upload Crop Image
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:bg-white/20 hover:scale-105 active:scale-95 flex items-center gap-2">
                🤖 Ask AI Assistant
              </button>
            </div>
            
            {/* Feature Chips */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {[
                { icon: '🌾', text: 'Pest Detection', gradient: 'from-green-500/20 to-green-600/20' },
                { icon: '🤖', text: 'AI Chat', gradient: 'from-blue-500/20 to-blue-600/20' },
                { icon: '📊', text: 'Market Prices', gradient: 'from-purple-500/20 to-purple-600/20' },
                { icon: '🌤', text: 'Weather', gradient: 'from-yellow-500/20 to-yellow-600/20' },
                { icon: '🏛', text: 'Govt Schemes', gradient: 'from-indigo-500/20 to-indigo-600/20' },
                { icon: '🧪', text: 'Soil Health', gradient: 'from-amber-500/20 to-amber-600/20' },
              ].map((item, idx) => (
                <span
                  key={item.text}
                  className={`feature-chip bg-gradient-to-r ${item.gradient} border border-white/10 text-white/90 text-sm px-4 py-2 rounded-full cursor-pointer transition-all`}
                  style={{ animationDelay: `${0.4 + idx * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
                >
                  {item.icon} {item.text}
                </span>
              ))}
            </div>
          </div>
          
          {/* Right Side - Moving Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="float-phone relative">
              {/* Phone Frame */}
              <div className="relative w-[300px] md:w-[350px] lg:w-[380px]">
                {/* Phone Outer Border */}
                <div className="phone-screen rounded-[3rem] p-2 bg-gradient-to-br from-gray-800 to-gray-900">
                  {/* Phone Screen Content */}
                  <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-[2.5rem] overflow-hidden">
                    
                    {/* Status Bar */}
                    <div className="px-5 pt-3 pb-2 flex justify-between text-[10px] text-gray-400">
                      <span>9:41</span>
                      <span>📶 🔋 100%</span>
                    </div>
                    
                    {/* Header */}
                    <div className="px-5 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center text-xs">🌾</div>
                        <div>
                          <div className="text-xs font-bold text-white">HaritBandhu AI</div>
                          <div className="text-[10px] text-green-400 flex items-center gap-1">
                            <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" /> Online
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Upload Area */}
                    <div className="p-4 border-b border-white/10">
                      <button className="w-full bg-green-500/20 border border-green-500/30 rounded-xl py-2 text-xs text-green-400 font-medium flex items-center justify-center gap-2 transition-all hover:bg-green-500/30">
                        📸 + Upload crop image for AI analysis
                      </button>
                    </div>
                    
                    {/* Rotating Detection Result */}
                    <div className="p-4 border-b border-white/10">
                      <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{currentTip.icon}</span>
                          <span className="font-bold text-white text-sm">{currentTip.title}</span>
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Alert</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Confidence:</span>
                            <span className="text-green-400 font-medium">{currentTip.confidence}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Treatment:</span>
                            <span className="text-white">{currentTip.treatment}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* User Question */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gray-700 flex items-center justify-center text-xs">👨‍🌾</div>
                        <div className="flex-1 bg-gray-800/50 rounded-xl px-3 py-2 text-xs text-gray-300">
                          My wheat leaves are yellowing
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Response */}
                    <div className="px-4 py-3">
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center text-xs">🌾</div>
                        <div className="flex-1 bg-green-500/10 rounded-xl px-3 py-2 text-xs text-gray-300">
                          <span className="text-green-400 font-medium">Yellow leaves in wheat</span> can indicate nitrogen deficiency. 
                          Apply urea at 20kg/acre and maintain proper irrigation.
                        </div>
                      </div>
                    </div>
                    
                    {/* Weather Alert */}
                    <div className="mx-4 mb-4 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <div className="flex items-center gap-2 text-xs">
                        <span>🌧️</span>
                        <span className="text-yellow-400 font-medium">Weather Alert:</span>
                        <span className="text-gray-300">Heavy rain expected on Wednesday</span>
                      </div>
                    </div>
                    
                    {/* Bottom Badge */}
                    <div className="px-4 pb-4">
                      <div className="text-center text-[10px] text-gray-500 flex items-center justify-center gap-2">
                        <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                        95% Accurate AI Pest Detection
                      </div>
                    </div>
                    
                    {/* Home Indicator */}
                    <div className="py-2 flex justify-center">
                      <div className="w-24 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Phone Notch */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-black rounded-b-xl"></div>
                
                {/* Side Buttons */}
                <div className="absolute left-[-3px] top-24 w-1 h-8 bg-gray-700 rounded-l-lg"></div>
                <div className="absolute left-[-3px] top-36 w-1 h-12 bg-gray-700 rounded-l-lg"></div>
                <div className="absolute right-[-3px] top-28 w-1 h-10 bg-gray-700 rounded-r-lg"></div>
              </div>
            </div>
            
            {/* Floating particles around phone */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
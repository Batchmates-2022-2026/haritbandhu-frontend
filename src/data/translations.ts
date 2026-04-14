export type LangCode = 'hi' | 'en' | 'mr' | 'gu' | 'kn' | 'ml';

export const languageOptions: { code: LangCode; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
];

export const langToSpeech: Record<LangCode, string> = {
  hi: 'hi-IN', en: 'en-US', mr: 'mr-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN',
};

type TranslationKeys = {
  welcome: string; chooseLanguage: string; getStarted: string; login: string; signup: string;
  email: string; password: string; confirmPassword: string; fullName: string; phone: string;
  city: string; forgotPassword: string; noAccount: string; hasAccount: string;
  home: string; services: string; pestDetection: string; aiChat: string; marketPrices: string;
  schemes: string; profile: string; logout: string; dashboard: string; admin: string;
  heroTitle: string; heroSubtitle: string; takePhoto: string; analyzeImage: string;
  simulatePest: string; confidenceScore: string; treatmentRec: string; getPlan: string;
  saveProfile: string; changePassword: string; changeEmail: string; oldPassword: string;
  newPassword: string; newEmail: string; username: string; soilHealth: string;
  weather: string; temperature: string; humidity: string; wind: string;
  askQuestion: string; quickQuestions: string; send: string;
  cropType: string; soilType: string; climate: string; farmSize: string;
  submit: string; cancel: string; save: string; back: string;
  adminDashboard: string; totalUsers: string; activeUsers: string; recentActivity: string;
};

export const translations: Record<LangCode, TranslationKeys> = {
  en: {
    welcome: 'Welcome to', chooseLanguage: 'Choose your language', getStarted: 'Get Started',
    login: 'Login', signup: 'Create Account', email: 'Email', password: 'Password',
    confirmPassword: 'Confirm Password', fullName: 'Full Name', phone: 'Phone Number',
    city: 'City', forgotPassword: 'Forgot Password?', noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    home: 'Home', services: 'Services', pestDetection: 'Pest Detection', aiChat: 'AI Chat',
    marketPrices: 'Market Prices', schemes: 'Schemes', profile: 'Profile', logout: 'Logout',
    dashboard: 'Dashboard', admin: 'Admin',
    heroTitle: 'Your Smart Farming Partner', heroSubtitle: 'AI-powered crop care, pest detection, weather alerts & market insights — all in one place.',
    takePhoto: 'Take Photo', analyzeImage: 'Analyze Image', simulatePest: 'Or Simulate a Pest Detection:',
    confidenceScore: 'Confidence Score', treatmentRec: 'Treatment Recommendations', getPlan: 'Get AI Pest Treatment Plan',
    saveProfile: 'Save Profile', changePassword: 'Change Password', changeEmail: 'Change Email',
    oldPassword: 'Old Password', newPassword: 'New Password', newEmail: 'New Email', username: 'Username',
    soilHealth: 'Soil Health', weather: 'Weather', temperature: 'Temperature', humidity: 'Humidity', wind: 'Wind',
    askQuestion: 'Ask a farming question...', quickQuestions: 'Quick Questions', send: 'Send',
    cropType: 'Crop Type', soilType: 'Soil Type', climate: 'Climate', farmSize: 'Farm Size',
    submit: 'Submit', cancel: 'Cancel', save: 'Save', back: 'Back',
    adminDashboard: 'Admin Dashboard', totalUsers: 'Total Users', activeUsers: 'Active Users', recentActivity: 'Recent Activity',
  },
  hi: {
    welcome: 'स्वागत है', chooseLanguage: 'अपनी भाषा चुनें', getStarted: 'शुरू करें',
    login: 'लॉगिन', signup: 'खाता बनाएं', email: 'ईमेल', password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड पुष्टि करें', fullName: 'पूरा नाम', phone: 'फोन नंबर',
    city: 'शहर', forgotPassword: 'पासवर्ड भूल गए?', noAccount: 'खाता नहीं है?',
    hasAccount: 'पहले से खाता है?',
    home: 'होम', services: 'सेवाएं', pestDetection: 'कीट पहचान', aiChat: 'AI चैट',
    marketPrices: 'बाजार भाव', schemes: 'योजनाएं', profile: 'प्रोफ़ाइल', logout: 'लॉगआउट',
    dashboard: 'डैशबोर्ड', admin: 'एडमिन',
    heroTitle: 'आपका स्मार्ट खेती साथी', heroSubtitle: 'AI-संचालित फसल देखभाल, कीट पहचान, मौसम अलर्ट और बाजार जानकारी — सब एक जगह।',
    takePhoto: 'फोटो लें', analyzeImage: 'छवि विश्लेषण', simulatePest: 'या कीट पहचान सिमुलेट करें:',
    confidenceScore: 'विश्वास स्कोर', treatmentRec: 'उपचार सिफारिशें', getPlan: 'AI कीट उपचार योजना प्राप्त करें',
    saveProfile: 'प्रोफ़ाइल सहेजें', changePassword: 'पासवर्ड बदलें', changeEmail: 'ईमेल बदलें',
    oldPassword: 'पुराना पासवर्ड', newPassword: 'नया पासवर्ड', newEmail: 'नई ईमेल', username: 'उपयोगकर्ता नाम',
    soilHealth: 'मिट्टी स्वास्थ्य', weather: 'मौसम', temperature: 'तापमान', humidity: 'नमी', wind: 'हवा',
    askQuestion: 'खेती से जुड़ा सवाल पूछें...', quickQuestions: 'जल्दी के सवाल', send: 'भेजें',
    cropType: 'फसल प्रकार', soilType: 'मिट्टी प्रकार', climate: 'जलवायु', farmSize: 'खेत का आकार',
    submit: 'जमा करें', cancel: 'रद्द करें', save: 'सहेजें', back: 'वापस',
    adminDashboard: 'एडमिन डैशबोर्ड', totalUsers: 'कुल उपयोगकर्ता', activeUsers: 'सक्रिय उपयोगकर्ता', recentActivity: 'हाल की गतिविधि',
  },
  mr: {
    welcome: 'स्वागत आहे', chooseLanguage: 'तुमची भाषा निवडा', getStarted: 'सुरू करा',
    login: 'लॉगिन', signup: 'खाते तयार करा', email: 'ईमेल', password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड पुष्टी करा', fullName: 'पूर्ण नाव', phone: 'फोन नंबर',
    city: 'शहर', forgotPassword: 'पासवर्ड विसरलात?', noAccount: 'खाते नाही?',
    hasAccount: 'आधीच खाते आहे?',
    home: 'होम', services: 'सेवा', pestDetection: 'कीड ओळख', aiChat: 'AI चॅट',
    marketPrices: 'बाजार भाव', schemes: 'योजना', profile: 'प्रोफाइल', logout: 'लॉगआउट',
    dashboard: 'डॅशबोर्ड', admin: 'ॲडमिन',
    heroTitle: 'तुमचा स्मार्ट शेती साथी', heroSubtitle: 'AI-चालित पीक देखभाल, कीड ओळख, हवामान सूचना आणि बाजार माहिती.',
    takePhoto: 'फोटो घ्या', analyzeImage: 'प्रतिमा विश्लेषण', simulatePest: 'किंवा कीड ओळख सिम्युलेट करा:',
    confidenceScore: 'विश्वास स्कोर', treatmentRec: 'उपचार शिफारसी', getPlan: 'AI कीड उपचार योजना मिळवा',
    saveProfile: 'प्रोफाइल जतन करा', changePassword: 'पासवर्ड बदला', changeEmail: 'ईमेल बदला',
    oldPassword: 'जुना पासवर्ड', newPassword: 'नवा पासवर्ड', newEmail: 'नवा ईमेल', username: 'वापरकर्ता नाव',
    soilHealth: 'माती आरोग्य', weather: 'हवामान', temperature: 'तापमान', humidity: 'आर्द्रता', wind: 'वारा',
    askQuestion: 'शेतीचा प्रश्न विचारा...', quickQuestions: 'द्रुत प्रश्न', send: 'पाठवा',
    cropType: 'पीक प्रकार', soilType: 'माती प्रकार', climate: 'हवामान', farmSize: 'शेत आकार',
    submit: 'सबमिट करा', cancel: 'रद्द करा', save: 'जतन करा', back: 'मागे',
    adminDashboard: 'ॲडमिन डॅशबोर्ड', totalUsers: 'एकूण वापरकर्ते', activeUsers: 'सक्रिय वापरकर्ते', recentActivity: 'अलीकडील क्रिया',
  },
  gu: {
    welcome: 'સ્વાગત છે', chooseLanguage: 'તમારી ભાષા પસંદ કરો', getStarted: 'શરૂ કરો',
    login: 'લૉગિન', signup: 'ખાતું બનાવો', email: 'ઈમેલ', password: 'પાસવર્ડ',
    confirmPassword: 'પાસવર્ડ પુષ્ટિ', fullName: 'પૂરું નામ', phone: 'ફોન',
    city: 'શહેર', forgotPassword: 'પાસવર્ડ ભૂલી ગયા?', noAccount: 'ખાતું નથી?',
    hasAccount: 'ખાતું છે?',
    home: 'હોમ', services: 'સેવાઓ', pestDetection: 'જંતુ ઓળખ', aiChat: 'AI ચેટ',
    marketPrices: 'બજાર ભાવ', schemes: 'યોજનાઓ', profile: 'પ્રોફાઇલ', logout: 'લૉગઆઉટ',
    dashboard: 'ડેશબોર્ડ', admin: 'એડમિન',
    heroTitle: 'તમારો સ્માર્ટ ખેતી સાથી', heroSubtitle: 'AI-સંચાલિત પાક સંભાળ.',
    takePhoto: 'ફોટો લો', analyzeImage: 'છબી વિશ્લેષણ', simulatePest: 'અથવા જંતુ ઓળખ:',
    confidenceScore: 'વિશ્વાસ સ્કોર', treatmentRec: 'ઉપચાર', getPlan: 'AI યોજના મેળવો',
    saveProfile: 'પ્રોફાઇલ સાચવો', changePassword: 'પાસવર્ડ બદલો', changeEmail: 'ઈમેલ બદલો',
    oldPassword: 'જૂનો પાસવર્ડ', newPassword: 'નવો પાસવર્ડ', newEmail: 'નવો ઈમેલ', username: 'વપરાશકર્તા',
    soilHealth: 'માટી આરોગ્ય', weather: 'હવામાન', temperature: 'તાપમાન', humidity: 'ભેજ', wind: 'પવન',
    askQuestion: 'ખેતી વિશે પૂછો...', quickQuestions: 'ઝડપી પ્રશ્નો', send: 'મોકલો',
    cropType: 'પાક', soilType: 'માટી', climate: 'આબોહવા', farmSize: 'ખેત',
    submit: 'સબમિટ', cancel: 'રદ', save: 'સાચવો', back: 'પાછા',
    adminDashboard: 'એડમિન ડેશબોર્ડ', totalUsers: 'કુલ', activeUsers: 'સક્રિય', recentActivity: 'તાજેતરની',
  },
  kn: {
    welcome: 'ಸ್ವಾಗತ', chooseLanguage: 'ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ', getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    login: 'ಲಾಗಿನ್', signup: 'ಖಾತೆ ರಚಿಸಿ', email: 'ಇಮೇಲ್', password: 'ಪಾಸ್‌ವರ್ಡ್',
    confirmPassword: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ', fullName: 'ಪೂರ್ಣ ಹೆಸರು', phone: 'ಫೋನ್',
    city: 'ನಗರ', forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?', noAccount: 'ಖಾತೆ ಇಲ್ಲವೇ?',
    hasAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆ?',
    home: 'ಮುಖಪುಟ', services: 'ಸೇವೆಗಳು', pestDetection: 'ಕೀಟ ಗುರುತಿಸುವಿಕೆ', aiChat: 'AI ಚಾಟ್',
    marketPrices: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ', schemes: 'ಯೋಜನೆಗಳು', profile: 'ಪ್ರೊಫೈಲ್', logout: 'ಲಾಗ್ ಔಟ್',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', admin: 'ನಿರ್ವಾಹಕ',
    heroTitle: 'ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಂಗಾತಿ', heroSubtitle: 'AI-ಚಾಲಿತ ಬೆಳೆ ಆರೈಕೆ.',
    takePhoto: 'ಫೋಟೋ ತೆಗೆಯಿರಿ', analyzeImage: 'ಚಿತ್ರ ವಿಶ್ಲೇಷಣೆ', simulatePest: 'ಅಥವಾ ಸಿಮ್ಯುಲೇಟ್:',
    confidenceScore: 'ವಿಶ್ವಾಸ ಸ್ಕೋರ್', treatmentRec: 'ಚಿಕಿತ್ಸೆ', getPlan: 'AI ಯೋಜನೆ ಪಡೆಯಿರಿ',
    saveProfile: 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ', changePassword: 'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಿಸಿ', changeEmail: 'ಇಮೇಲ್ ಬದಲಿಸಿ',
    oldPassword: 'ಹಳೆ ಪಾಸ್‌ವರ್ಡ್', newPassword: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್', newEmail: 'ಹೊಸ ಇಮೇಲ್', username: 'ಬಳಕೆದಾರ',
    soilHealth: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ', weather: 'ಹವಾಮಾನ', temperature: 'ತಾಪಮಾನ', humidity: 'ತೇವಾಂಶ', wind: 'ಗಾಳಿ',
    askQuestion: 'ಕೃಷಿ ಪ್ರಶ್ನೆ ಕೇಳಿ...', quickQuestions: 'ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳು', send: 'ಕಳುಹಿಸಿ',
    cropType: 'ಬೆಳೆ', soilType: 'ಮಣ್ಣು', climate: 'ಹವಾಮಾನ', farmSize: 'ಜಮೀನು',
    submit: 'ಸಲ್ಲಿಸಿ', cancel: 'ರದ್ದು', save: 'ಉಳಿಸಿ', back: 'ಹಿಂದೆ',
    adminDashboard: 'ನಿರ್ವಾಹಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', totalUsers: 'ಒಟ್ಟು', activeUsers: 'ಸಕ್ರಿಯ', recentActivity: 'ಇತ್ತೀಚಿನ',
  },
  ml: {
    welcome: 'സ്വാഗതം', chooseLanguage: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക', getStarted: 'ആരംഭിക്കുക',
    login: 'ലോഗിൻ', signup: 'അക്കൗണ്ട് ഉണ്ടാക്കുക', email: 'ഇമെയിൽ', password: 'പാസ്‌വേഡ്',
    confirmPassword: 'പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക', fullName: 'പൂർണ നാമം', phone: 'ഫോൺ',
    city: 'നഗരം', forgotPassword: 'പാസ്‌വേഡ് മറന്നോ?', noAccount: 'അക്കൗണ്ട് ഇല്ലേ?',
    hasAccount: 'അക്കൗണ്ട് ഉണ്ടോ?',
    home: 'ഹോം', services: 'സേവനങ്ങൾ', pestDetection: 'കീട തിരിച്ചറിയൽ', aiChat: 'AI ചാറ്റ്',
    marketPrices: 'വിപണി വില', schemes: 'പദ്ധതികൾ', profile: 'പ്രൊഫൈൽ', logout: 'ലോഗൗട്ട്',
    dashboard: 'ഡാഷ്‌ബോർഡ്', admin: 'അഡ്മിൻ',
    heroTitle: 'നിങ്ങളുടെ സ്മാർട്ട് കൃഷി പങ്കാളി', heroSubtitle: 'AI-പവർഡ് വിള പരിചരണം.',
    takePhoto: 'ഫോട്ടോ എടുക്കുക', analyzeImage: 'ചിത്ര വിശകലനം', simulatePest: 'അല്ലെങ്കിൽ സിമുലേറ്റ്:',
    confidenceScore: 'വിശ്വാസ സ്കോർ', treatmentRec: 'ചികിത്സ', getPlan: 'AI പ്ലാൻ നേടുക',
    saveProfile: 'പ്രൊഫൈൽ സേവ്', changePassword: 'പാസ്‌വേഡ് മാറ്റുക', changeEmail: 'ഇമെയിൽ മാറ്റുക',
    oldPassword: 'പഴയ പാസ്‌വേഡ്', newPassword: 'പുതിയ പാസ്‌വേഡ്', newEmail: 'പുതിയ ഇമെയിൽ', username: 'ഉപയോക്താവ്',
    soilHealth: 'മണ്ണിന്റെ ആരോഗ്യം', weather: 'കാലാവസ്ഥ', temperature: 'താപനില', humidity: 'ഈർപ്പം', wind: 'കാറ്റ്',
    askQuestion: 'കൃഷി ചോദ്യം ചോദിക്കൂ...', quickQuestions: 'ദ്രുത ചോദ്യങ്ങൾ', send: 'അയയ്ക്കുക',
    cropType: 'വിള', soilType: 'മണ്ണ്', climate: 'കാലാവസ്ഥ', farmSize: 'കൃഷിഭൂമി',
    submit: 'സമർപ്പിക്കുക', cancel: 'റദ്ദാക്കുക', save: 'സേവ്', back: 'മടങ്ങുക',
    adminDashboard: 'അഡ്മിൻ ഡാഷ്‌ബോർഡ്', totalUsers: 'മൊത്തം', activeUsers: 'സജീവം', recentActivity: 'സമീപകാല',
  },
};

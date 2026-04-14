export const pestDatabase: Record<string, {
  name: string; emoji: string; confidence: number; message: string;
  symptoms: string[]; treatments: string[];
}> = {
  Aphids: {
    name: "Aphids", emoji: "🦟", confidence: 92,
    message: "Aphid infestation detected on your crop. These small sap-sucking insects can cause significant yield loss if untreated.",
    symptoms: ["Yellowing leaves", "Stunted growth", "Sticky honeydew residue"],
    treatments: ["Spray neem oil solution (5ml/L water) every 7 days", "Apply insecticidal soap spray on affected areas", "Introduce natural predators (ladybugs, lacewings)", "Use yellow sticky traps to monitor population"],
  },
  Armyworm: {
    name: "Armyworm", emoji: "🐛", confidence: 88,
    message: "Fall Armyworm detected. This highly destructive pest can devastate entire fields rapidly.",
    symptoms: ["Large holes in leaves", "Defoliation", "Frass visible on plants"],
    treatments: ["Apply Spinetoram or Chlorantraniliprole pesticide", "Use pheromone traps", "Spray Bacillus thuringiensis (Bt)", "Early morning/evening spray for best effectiveness"],
  },
  Whitefly: {
    name: "Whitefly", emoji: "🦋", confidence: 85,
    message: "Whitefly infestation identified. These pests transmit viruses and reduce photosynthesis.",
    symptoms: ["White cloud when plant disturbed", "Yellow stippling on leaves", "Sooty mold growth"],
    treatments: ["Apply imidacloprid systemic insecticide", "Use reflective silver mulch", "Install yellow sticky traps", "Spray neem oil + soap solution weekly"],
  },
  "Stem Borer": {
    name: "Stem Borer", emoji: "🪲", confidence: 91,
    message: "Stem Borer larvae detected inside crop stems. This causes 'dead heart' and 'white ear' symptoms.",
    symptoms: ["Dead central shoot", "Holes in stems", "Sawdust-like frass at entry points"],
    treatments: ["Apply Chlorpyrifos 20 EC @ 2.5 ml/L", "Use Coragen for long-lasting control", "Release Trichogramma parasitoid wasps", "Remove infested stems immediately"],
  },
  "Leaf Blight": {
    name: "Leaf Blight", emoji: "🍂", confidence: 87,
    message: "Leaf Blight (fungal) detected. This disease spreads rapidly in humid conditions.",
    symptoms: ["Brown/tan lesions with yellow halos", "Lesions enlarge and merge", "Severe leaf drying"],
    treatments: ["Spray Mancozeb 75 WP @ 2.5 g/L", "Apply Propiconazole 25 EC", "Improve field drainage", "Remove and burn affected material"],
  },
};

export const marketData = [
  { name: "Wheat", nameHi: "गेहूं", emoji: "🌾", price: 2215, prev: 2150, market: "Kanpur Mandi", trend: "up" as const },
  { name: "Rice", nameHi: "चावल", emoji: "🍚", price: 3100, prev: 3180, market: "Lucknow Mandi", trend: "down" as const },
  { name: "Maize", nameHi: "मक्का", emoji: "🌽", price: 1870, prev: 1860, market: "Agra Mandi", trend: "up" as const },
  { name: "Soybean", nameHi: "सोयाबीन", emoji: "🫘", price: 4200, prev: 4200, market: "Bhopal Mandi", trend: "stable" as const },
  { name: "Cotton", nameHi: "कपास", emoji: "🌸", price: 6800, prev: 6500, market: "Nagpur Mandi", trend: "up" as const },
  { name: "Sugarcane", nameHi: "गन्ना", emoji: "🎋", price: 340, prev: 330, market: "Meerut Mandi", trend: "up" as const },
  { name: "Mustard", nameHi: "सरसों", emoji: "🌻", price: 5400, prev: 5600, market: "Jaipur Mandi", trend: "down" as const },
  { name: "Tomato", nameHi: "टमाटर", emoji: "🍅", price: 2200, prev: 1800, market: "Delhi Mandi", trend: "up" as const },
];

export const schemesData = [
  { emoji: "💰", name: "PM-KISAN", full: "Pradhan Mantri Kisan Samman Nidhi", desc: "₹6,000/year direct income support in three equal installments.", benefit: "₹6,000/year", link: "https://pmkisan.gov.in", cat: "Financial" },
  { emoji: "🌾", name: "Fasal Bima", full: "Pradhan Mantri Fasal Bima Yojana", desc: "Crop insurance against natural calamities, pests, and diseases.", benefit: "Up to ₹2L coverage", link: "https://pmfby.gov.in", cat: "Insurance" },
  { emoji: "💳", name: "KCC", full: "Kisan Credit Card Scheme", desc: "Short-term credit for crop production needs at 7% interest.", benefit: "Credit up to ₹3L", link: "https://www.nabard.org", cat: "Financial" },
  { emoji: "🚜", name: "SMAM", full: "Sub-Mission on Agricultural Mechanization", desc: "Subsidies up to 50% for purchasing agricultural machinery.", benefit: "50% subsidy", link: "https://agrimachinery.nic.in", cat: "Equipment" },
  { emoji: "💧", name: "PM-KUSUM", full: "Pradhan Mantri Kisan Urja Suraksha", desc: "Solar-powered irrigation pumps to reduce electricity dependency.", benefit: "Solar pump subsidy", link: "#", cat: "Energy" },
  { emoji: "🌱", name: "Soil Health Card", full: "Soil Health Card Scheme", desc: "Free soil testing and customized fertilizer recommendations.", benefit: "Free testing", link: "#", cat: "Farming" },
];

export const soilTypes = [
  { name: "Alluvial Soil", nameHi: "जलोढ़ मिट्टी", ph: "6.5-7.5", crops: ["Rice", "Wheat", "Sugarcane"], color: "#8B7355" },
  { name: "Black Soil", nameHi: "काली मिट्टी", ph: "7.2-8.5", crops: ["Cotton", "Soybean", "Sorghum"], color: "#2C2C2C" },
  { name: "Red Soil", nameHi: "लाल मिट्टी", ph: "6.0-6.5", crops: ["Groundnut", "Millets", "Tobacco"], color: "#C0392B" },
  { name: "Laterite Soil", nameHi: "लेटराइट मिट्टी", ph: "5.0-6.0", crops: ["Tea", "Coffee", "Cashew"], color: "#A0522D" },
  { name: "Sandy Soil", nameHi: "बालू मिट्टी", ph: "5.5-7.0", crops: ["Bajra", "Guar", "Pulses"], color: "#DEB887" },
];

export const quickChatQuestions = [
  { icon: '🌾', text: 'Yellowing wheat leaves?' },
  { icon: '🌸', text: 'Cotton pesticide timing?' },
  { icon: '💰', text: 'How to apply for PM-KISAN?' },
  { icon: '🌧️', text: 'Best crop for monsoon season?' },
  { icon: '🌱', text: 'How to improve soil fertility?' },
  { icon: '🍚', text: 'Rice stem borer symptoms?' },
  { icon: '💡', text: 'How to reduce farming cost?' },
];

export const getFallbackResponse = (query: string): string => {
  const q = query.toLowerCase();
  if (q.includes('wheat') || q.includes('yellow') || q.includes('गेहूं'))
    return '🌾 **Yellowing Wheat Leaves** can indicate:\n\n• **Nitrogen deficiency** — Apply Urea 30kg/acre\n• **Rust disease** — Spray Propiconazole 25 EC\n• **Aphid attack** — Check for tiny insects\n\n**Immediate Action:** Spray 2% Urea foliar spray as quick fix.';
  if (q.includes('cotton') || q.includes('pesticide') || q.includes('कपास'))
    return '🌸 **Best Pesticide Timing:**\n\n• **Early morning (6-8 AM)** — Best for systemic\n• **Evening (5-7 PM)** — Ideal for contact\n\n**For Bollworm:** Chlorpyrifos 20 EC @ 2ml/L\n⚠️ Always use protective gear';
  if (q.includes('kisan') || q.includes('pm-kisan'))
    return '💰 **PM-KISAN Scheme:**\n\n• **Benefit:** ₹6,000/year in 3 installments\n• **Apply at:** pmkisan.gov.in or CSC center\n• **Documents:** Aadhaar, Bank account, Land records';
  if (q.includes('monsoon') || q.includes('crop') || q.includes('फसल'))
    return '🌧️ **Best Monsoon Crops (Kharif):**\n\n• **Paddy/Rice** — Waterlogged areas\n• **Maize** — High yield, 90-day crop\n• **Soybean** — Good for black soil\n• **Cotton** — UP, Maharashtra, Gujarat';
  if (q.includes('soil') || q.includes('fertil') || q.includes('मिट्टी'))
    return '🌱 **Soil Fertility Tips:**\n\n• **Green manure** — Grow dhaincha before transplanting\n• **Vermicompost** — 2-3 ton/acre\n• **Crop rotation** — Alternate legumes with cereals\n• **Biofertilizers** — Rhizobium, PSB\n\n💡 Get FREE Soil Health Card!';
  return '🌾 I can help with:\n\n• **Pest identification** — Upload a photo\n• **Crop care** — Fertilizer & treatment\n• **Market prices** — Best time to sell\n• **Government schemes** — PM-KISAN, Fasal Bima\n• **Weather alerts** — Local forecasts\n\nPlease ask something specific!';
};

## Wishfin Hindi Voice Sales Agent

यह प्रोजेक्ट Wishfin.com के लिए एक वेब-आधारित हिंदी सेल्स एजेंट प्रदान करता है। एजेंट ब्राउज़र में वॉयस बातचीत करता है, ग्राहक को लोन विकल्प समझाता है और कॉल के बाद एसएमएस व व्हाट्सएप संदेश भेजने का इंटरफ़ेस देता है।

### मुख्य सुविधाएँ

- Web Speech API द्वारा हिंदी वॉयस वार्तालाप, लोन योग्यता चरणों के साथ
- पूर्व-निर्धारित Wishfin स्क्रिप्ट और कॉल फ्लो कार्ड
- एसएमएस/व्हाट्सएप टेम्पलेट लाइब्रेरी, placeholders के साथ कस्टमाइज़ेशन
- Twilio API के माध्यम से सुरक्षित संदेश भेजना (विकास मोड में प्रीव्यू)
- Tailwind CSS 4 आधारित आधुनिक UI, Vercel पर तैनाती के लिए तैयार

### लोकल सेटअप

```bash
npm install
npm run dev
```

ब्राउज़र में `http://localhost:3000` खोलें। बेहतर वॉयस अनुभव के लिए Chrome या Edge का उपयोग करें।

### पर्यावरण चर

Twilio के साथ उत्पादन/स्टेजिंग पर संदेश भेजने के लिए नीचे दिए गए चर सेट करें:

```bash
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_SMS_FROM=+1XXXXXXXXXX          # Twilio SMS नंबर
TWILIO_WHATSAPP_FROM=whatsapp:+1XXXXXX # Twilio WhatsApp सेंडर
```

लोकल डेवलपमेंट में यदि ये चर सेट नहीं हैं, तो API प्रीव्यू मोड में चलता है और वास्तविक संदेश नहीं भेजे जाते।

### उपलब्ध स्क्रिप्ट्स

- `npm run dev` – विकास सर्वर
- `npm run build` – प्रोडक्शन बिल्ड
- `npm start` – प्रोडक्शन सर्वर (लोकल टेस्टिंग)
- `npm run lint` – ESLint

### प्रोडक्शन डिप्लॉयमेंट

प्रोजेक्ट Vercel पर `vercel deploy --prod` कमांड से पुश किया जा सकता है (पर्याप्त `VERCEL_TOKEN` के साथ)। डिप्लॉय करने से पहले बिल्ड अवश्य चलाएँ:

```bash
npm run lint
npm run build
```

तैनाती के बाद `https://agentic-6f41d282.vercel.app` पर एप्लिकेशन उपलब्ध होगा।

### फोल्डर संरचना

```
src/
  app/               # Next.js app router
    api/             # Twilio संदेश API रूट्स
    page.tsx         # मुख्य UI पेज
    globals.css      # Tailwind 4 ग्लोबल स्टाइल्स
  components/        # VoiceAgent, MessageSender आदि
  config/            # संदेश टेम्पलेट्स, उत्पाद डेटा
  lib/               # बातचीत लॉजिक (agent.ts)
  types/             # speech recognition टाइप डिक्लेरेशन
```

### समर्थन और कस्टमाइज़ेशन

- `src/lib/agent.ts` में बातचीत के चरण और हिंदी स्क्रिप्ट को बदला जा सकता है।
- `src/config/messages.ts` में एसएमएस/व्हाट्सएप टेम्पलेट जोड़े या संपादित किए जा सकते हैं।
- अतिरिक्त बैंक/एनबीएफसी ऑफ़र कार्ड `src/config/products.ts` में संशोधित करें।

किसी भी सहायता के लिए Wishfin सेल्स ऑटोमेशन टीम से संपर्क करें।

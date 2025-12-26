export interface LoanProduct {
  id: string;
  title: string;
  apr: string;
  highlights: string[];
  turnaround: string;
}

export const loanProducts: LoanProduct[] = [
  {
    id: "personal",
    title: "पर्सनल लोन",
    apr: "10.49% से शुरुआत",
    turnaround: "24 घंटे में डिस्बर्सल",
    highlights: [
      "₹50,000 से ₹30 लाख तक",
      "नो-कोलेटरल, त्वरित प्रक्रिया",
      "शीघ्र ईएमआई कैलकुलेटर और तुलना",
    ],
  },
  {
    id: "business",
    title: "बिज़नेस और एमएसएमई लोन",
    apr: "9.75% से शुरुआत",
    turnaround: "3-5 कार्य दिवस",
    highlights: [
      "वर्किंग कैपिटल और टर्म लोन विकल्प",
      "जीएसटी / बैंक स्टेटमेंट आधारित रीकैडिट",
      "उद्योग-विशेष सलाह",
    ],
  },
  {
    id: "home",
    title: "होम लोन",
    apr: "8.40% से शुरुआत",
    turnaround: "5-7 कार्य दिवस",
    highlights: [
      "30 साल तक टेन्योर",
      "इंस्टेंट प्री-अप्रूवल और दस्तावेज़ सहायता",
      "बैलेंस ट्रांसफर और टॉप-अप सुविधाएँ",
    ],
  },
];

export interface CallStep {
  id: string;
  title: string;
  description: string;
}

export const guidedCallFlow: CallStep[] = [
  {
    id: "greet",
    title: "1. गर्मजोशी से अभिवादन",
    description:
      "ग्राहक का नाम पुष्ट करें, विशफिन का भरोसेमंद परिचय दें और जरूरत समझने का आग्रह करें।",
  },
  {
    id: "qualify",
    title: "2. योग्यता जाँच",
    description:
      "आय, रोजगार और लोन उद्देश्य पूछें ताकि उपयुक्त उत्पाद मैच किए जा सकें।",
  },
  {
    id: "pitch",
    title: "3. व्यक्तिगत ऑफ़र",
    description:
      "ब्याज दर, ईएमआई और पुनर्भुगतान अवधि समझाते हुए ग्राहक की जरूरत के साथ जोड़ें।",
  },
  {
    id: "assure",
    title: "4. दस्तावेज़ और भरोसा",
    description:
      "दस्तावेज़ सूची साझा करें, डेटा सुरक्षा और विशफिन की बैंकिंग साझेदारियों की जानकारी दें।",
  },
  {
    id: "close",
    title: "5. कॉल टू एक्शन",
    description:
      "लिंक भेजें, आवेदन ड्राफ्ट करें और फॉलो-अप का आश्वासन दें ताकि रूपांतरण सुनिश्चित हो।",
  },
];


type Stage =
  | "introduction"
  | "qualification"
  | "need_analysis"
  | "pitch"
  | "documents"
  | "closing"
  | "fallback";

export interface AgentContext {
  stage: Stage;
  customerName?: string;
  loanType?: "personal" | "business" | "home" | "unknown";
  amount?: string;
  interestInterest?: string;
  followUpNeeded?: boolean;
}

interface AgentResponse {
  reply: string;
  stage: Stage;
  context: AgentContext;
}

const negativePhrases = [
  "नहीं",
  "interested नहीं",
  "मत भेजो",
  "बाद में",
  "नंबर हटाओ",
  "no",
  "stop",
  "don't",
  "call mat",
  "interest nahi",
];

const deferPhrases = ["बाद", "later", "time", "सोच", "सोचना"];

const loanKeywords: Record<NonNullable<AgentContext["loanType"]>, string[]> = {
  personal: ["personal", "पर्सनल", "salary", "सैलरी"],
  business: ["business", "बिज़नेस", "व्यापार", "msme"],
  home: ["home", "हाउस", "घर", "home loan", "property", "मकान"],
  unknown: [],
};

function detectNegative(input: string) {
  return negativePhrases.some((phrase) => input.includes(phrase));
}

function detectDefer(input: string) {
  return deferPhrases.some((phrase) => input.includes(phrase));
}

function detectLoanType(input: string): AgentContext["loanType"] {
  const normalized = input.toLowerCase();
  for (const [loanType, keywords] of Object.entries(loanKeywords)) {
    if (loanType === "unknown") continue;
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return loanType as AgentContext["loanType"];
    }
  }
  return "unknown";
}

function extractAmount(input: string) {
  const amountPattern = /(\d{1,3}(?:[,\s]?\d{2,3})*(?:\s?(?:लाख|करोड़|crore|lakh))?)/i;
  const match = input.match(amountPattern);
  return match ? match[1].replaceAll(/\s+/g, " ").trim() : undefined;
}

function buildGreeting(context: AgentContext) {
  const baseName = context.customerName ? `${context.customerName} जी` : "जी";
  return `नमस्ते ${baseName}, मैं विशफिन डॉट कॉम से प्रिया बोल रही हूँ। हम आपको सबसे उपयुक्त लोन दिलाने में मदद करते हैं। क्या मैं आपकी वित्तीय ज़रूरत के बारे में थोड़ा जान सकती हूँ?`;
}

export function initialAgentState(): AgentResponse {
  const context: AgentContext = {
    stage: "introduction",
  };
  return {
    reply: buildGreeting(context),
    stage: "introduction",
    context,
  };
}

export function agentReply(
  customerUtterance: string,
  previous: AgentContext,
): AgentResponse {
  const input = customerUtterance.trim().toLowerCase();

  if (!input) {
    return {
      reply:
        "माफ़ कीजिएगा, मैं आपको ठीक से सुन नहीं पाई। क्या आप दोबारा बता सकते हैं कि आपको किस तरह की वित्तीय सहायता चाहिए?",
      stage: previous.stage,
      context: previous,
    };
  }

  if (detectNegative(input)) {
    return {
      reply:
        "कोई बात नहीं, मैं आपका नंबर नोट कर लेती हूँ और आगे आपको परेशान नहीं किया जाएगा। अगर कभी भविष्य में सहायता चाहिए तो विशफिन डॉट कॉम पर ज़रूर याद कीजिएगा। आपका दिन शुभ हो!",
      stage: "closing",
      context: { ...previous, followUpNeeded: false },
    };
  }

  if (detectDefer(input)) {
    return {
      reply:
        "समझ सकती हूँ कि अभी व्यस्त होंगे। मैं एक संक्षिप्त संदेश और व्हाट्सएप में विवरण भेज देती हूँ ताकि आप अपनी सुविधा से देख सकें। क्या मैं आपके लिए किसी विशेष समय का नोट बना दूँ?",
      stage: "closing",
      context: { ...previous, followUpNeeded: true },
    };
  }

  const loanType = previous.loanType ?? detectLoanType(input);
  const amount = previous.amount ?? extractAmount(customerUtterance);

  switch (previous.stage) {
    case "introduction": {
      return {
        reply:
          "बहुत बढ़िया! थोड़ी जानकारी साझा करिए ताकि मैं आपके लिए सटीक ऑफ़र निकाल सकूँ। आप किस उद्देश्य के लिए लोन लेना चाह रहे हैं और आपकी मासिक नेट आय कितनी है?",
        stage: "qualification",
        context: { ...previous, loanType, amount },
      };
    }
    case "qualification": {
      return {
        reply:
          "धन्यवाद! आपकी आय और आवश्यकता के आधार पर मैं तुरंत वैरीफाइड पार्टनर बैंकों से ऑफ़र मैच कर दूँगी। क्या आपके पास आधार, पैन और आय का प्रमाण उपलब्ध है?",
        stage: "need_analysis",
        context: { ...previous, loanType, amount },
      };
    }
    case "need_analysis": {
      return {
        reply:
          "उत्तम! दस्तावेज़ तैयार हैं तो प्रक्रिया बहुत तेज़ हो जाएगी। मैं आपको ब्याज दर, ईएमआई और डिस्बर्सल टाइमलाइन का पूरा विवरण अभी भेज रही हूँ।",
        stage: "pitch",
        context: { ...previous, loanType, amount },
      };
    }
    case "pitch": {
      const offerSpec =
        loanType === "home"
          ? "होम लोन पर 8.4% से शुरुआत और 30 साल तक का टेन्योर विकल्प"
          : loanType === "business"
            ? "एमएसएमई और बिज़नेस लोन पर 9.75% से दरें और working capital सुविधाएँ"
            : "पर्सनल लोन पर 10.49% से दरें और तुरंत प्री-अप्रूव्ड ऑफ़र";

      const loanDetail = amount
        ? `आपके बताए हुए ${amount} के लिए `
        : "आपकी आवश्यकता के लिए ";

      return {
        reply: `${loanDetail}${offerSpec} उपलब्ध है। ईएमआई कैलकुलेशन और दस्तावेज़ अपलोड लिंक मैं अभी भेजती हूँ। क्या मैं आवेदन ड्राफ्ट शुरू कर दूँ?`,
        stage: "documents",
        context: { ...previous, loanType, amount },
      };
    }
    case "documents": {
      return {
        reply:
          "बहुत बढ़िया! आवेदन ड्राफ्ट कर दिया है। अभी मैं आपको एसएमएस और व्हाट्सएप पर लिंक भेज रही हूँ जहाँ से आप दस्तावेज़ अपलोड कर सकते हैं।",
        stage: "closing",
        context: { ...previous, followUpNeeded: true },
      };
    }
    case "closing": {
      return {
        reply:
          "धन्यवाद! विशफिन पर भरोसा करने के लिए शुक्रिया। किसी भी समय सवाल हो तो इसी कॉल या व्हाट्सएप संदेश का जवाब दे दीजिएगा।",
        stage: "closing",
        context: previous,
      };
    }
    default: {
      return {
        reply:
          "मैंने आपकी बात नोट कर ली है। अगर कोई और जानकारी चाहिए तो बेझिझक बताइए।",
        stage: "fallback",
        context: previous,
      };
    }
  }
}

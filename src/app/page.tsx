import { MessageSender } from "@/components/MessageSender";
import { VoiceAgent } from "@/components/VoiceAgent";
import { loanProducts, guidedCallFlow } from "@/config/products";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-sky-100 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-10 lg:py-16">
        <Hero />
        <VoiceAgent />
        <MessageSender />
        <PromiseSection />
      </main>
      <footer className="border-t border-white/40 bg-white/60 py-6 text-center text-xs text-zinc-500 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400">
        © {new Date().getFullYear()} Wishfin.com — सुरक्षित, पारदर्शी और तेज़ लोन
        समाधान।
      </footer>
    </div>
  );
}

function Hero() {
  return (
    <section className="rounded-3xl border border-white/20 bg-white/80 p-8 shadow-xl shadow-emerald-500/10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Wishfin.com Agent Console
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
            हिंदी बोले जाने वाला डिजिटल सेल्स असिस्टेंट जो हर कॉल को लोन
            कन्वर्ज़न में बदल दे।
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 lg:max-w-2xl">
            यह एजेंट ग्राहकों की जरूरत समझता है, रीयल-टाइम ऑफ़र साझा करता है और
            तत्परता से एसएमएस तथा व्हाट्सएप फॉलो-अप भेजता है। ब्रांडेड स्क्रिप्ट,
            अनुपालन चेकलिस्ट और डाटा सुरक्षा के साथ Wishfin की सेल्स टीम के लिए
            तैयार।
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Badge>Real-time Hindi Conversation</Badge>
            <Badge>Loan Qualification Engine</Badge>
            <Badge>SMS & WhatsApp Automation</Badge>
            <Badge>Wishfin Compliance Ready</Badge>
          </div>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-emerald-400/50 bg-emerald-500/10 p-5 text-sm text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
          <h2 className="text-lg font-semibold text-emerald-700 dark:text-emerald-200">
            लोन कन्वर्ज़न फ्रेमवर्क
          </h2>
          <p>
            • ग्राहक को व्यक्तिगत ऑफ़र सुझाए जाते हैं<br />
            • सुरक्षित API से एसएमएस / व्हाट्सएप भेजें<br />
            • कॉल के बाद दस्तावेज़ सूची साझा करें<br />
            • Follow-up शेड्यूल ऑटो-टैग करें
          </p>
          <span className="text-xs uppercase tracking-widest text-emerald-600/80 dark:text-emerald-400/80">
            बैंकों और एनबीएफसी के लिए प्रमाणित संवाद
          </span>
        </div>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_3fr]">
        <article className="rounded-2xl border border-zinc-200/60 bg-white/90 p-6 dark:border-zinc-800 dark:bg-zinc-950/70">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Guided Call Flow
          </h2>
          <ul className="mt-4 grid gap-4 text-sm text-zinc-600 dark:text-zinc-300">
            {guidedCallFlow.map((step) => (
              <li key={step.id} className="rounded-xl border border-dashed border-emerald-400/40 p-4 dark:border-emerald-500/40">
                <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                  {step.title}
                </p>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {step.description}
                </p>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-zinc-200/60 bg-white/90 p-6 dark:border-zinc-800 dark:bg-zinc-950/70">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            प्रमुख लोन उत्पाद
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-zinc-600 dark:text-zinc-300">
            {loanProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-xl border border-zinc-200/80 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/60"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                    {product.title}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    {product.apr}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {product.turnaround}
                </p>
                <ul className="mt-3 grid gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                  {product.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-emerald-300/50 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
      {children}
    </span>
  );
}

function PromiseSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950/80">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          डेटा सुरक्षा और गोपनीयता
        </h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          ग्राहक की आवाज़ और व्यक्तिगत जानकारी ब्राउज़र से बाहर नहीं जाती।
          संदेश भेजने के लिए सुरक्षित सर्वर-से-सर्वर एन्क्रिप्शन उपयोग होता है।
        </p>
      </div>
      <div className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950/80">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          नियामक अनुपालन
        </h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          बीसी / डीएसए दिशानिर्देशों के अनुरूप स्क्रिप्ट, शर्तें और अनुमतियाँ
          सिस्टम में अंतर्निहित हैं ताकि सभी वार्तालाप संरचित रहें।
        </p>
      </div>
      <div className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950/80">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          कस्टमाइज़ेशन के लिए तैयार
        </h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          प्रक्रियाओं के अनुसार स्क्रिप्ट, मैसेज टेम्पलेट और बैंकिंग इंटीग्रेशन
          को आसानी से बदला जा सकता है। Wishfin टीम के लिए तैयार।
        </p>
      </div>
    </section>
  );
}

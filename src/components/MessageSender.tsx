"use client";

import { useMemo, useState } from "react";
import {
  messageTemplates,
  type MessageTemplate,
  fillTemplate,
} from "@/config/messages";

type StatusState =
  | { type: "idle" }
  | { type: "loading"; template: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

function groupTemplates(templates: MessageTemplate[]) {
  return templates.reduce<Record<string, MessageTemplate[]>>((acc, template) => {
    const key = template.channel === "sms" ? "एसएमएस" : "व्हाट्सएप";
    acc[key] = acc[key] ?? [];
    acc[key].push(template);
    return acc;
  }, {});
}

export function MessageSender() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<StatusState>({ type: "idle" });
  const [selectedTemplate, setSelectedTemplate] =
    useState<MessageTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});

  const groupedTemplates = useMemo(
    () => groupTemplates(messageTemplates),
    [],
  );

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setStatus({ type: "idle" });
    const defaults = template.variables.reduce<Record<string, string>>(
      (acc, key) => {
        acc[key] = variables[key] ?? "";
        return acc;
      },
      {},
    );
    setVariables(defaults);
  };

  const onVariableChange = (key: string, value: string) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const sendMessage = async () => {
    if (!selectedTemplate) {
      setStatus({ type: "error", message: "कृपया कोई टेम्पलेट चुनें।" });
      return;
    }
    if (!phone) {
      setStatus({ type: "error", message: "ग्राहक का मोबाइल नंबर दर्ज करें।" });
      return;
    }

    setStatus({ type: "loading", template: selectedTemplate.id });

    try {
      const endpoint =
        selectedTemplate.channel === "sms" ? "/api/send-sms" : "/api/send-whatsapp";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          templateId: selectedTemplate.id,
          variables,
          preview: process.env.NODE_ENV !== "production",
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message ?? "संदेश भेजने में समस्या आई।");
      }

      setStatus({
        type: "success",
        message:
          payload.previewBody ??
          "संदेश सफलतापूर्वक भेज दिया गया। बातचीत जारी रखें!",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "संदेश भेजने में कोई अज्ञात त्रुटि हुई।",
      });
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-lg shadow-sky-500/10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <header className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
            Follow-up मैसेजिंग
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            पूर्व-स्वीकृत एसएमएस और व्हाट्सएप टेम्पलेट भेजें
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            कॉल के तुरंत बाद ग्राहक को विवरण भेजिए ताकि रूपांतरण बढ़े।
          </p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3 rounded-2xl border border-zinc-200/70 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            ग्राहक मोबाइल नंबर
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+91 से शुरू करें, उदाहरण: +91XXXXXXXXXX"
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>

          {selectedTemplate && selectedTemplate.variables.length > 0 && (
            <div className="space-y-2 rounded-xl border border-dashed border-sky-400/50 p-3 text-sm dark:border-sky-500/30">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                वेरिएबल भरें
              </h3>
              {selectedTemplate.variables.map((variable) => (
                <label
                  key={variable}
                  className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300"
                >
                  {variable.toUpperCase()}
                  <input
                    value={variables[variable] ?? ""}
                    onChange={(event) =>
                      onVariableChange(variable, event.target.value)
                    }
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                    placeholder={`${variable} दर्ज करें`}
                  />
                </label>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={sendMessage}
            className="w-full rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            संदेश भेजें
          </button>

          {status.type === "success" && (
            <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
              {status.message}
            </div>
          )}
          {status.type === "error" && (
            <div className="rounded-xl border border-red-400/40 bg-red-400/10 px-3 py-2 text-xs text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              {status.message}
            </div>
          )}
          {status.type === "loading" && (
            <div className="rounded-xl border border-sky-400/40 bg-sky-400/10 px-3 py-2 text-xs text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200">
              भेजा जा रहा है… कृपया प्रतीक्षा करें।
            </div>
          )}
        </div>

        <div className="grid gap-3">
          {Object.entries(groupedTemplates).map(([channelLabel, templates]) => (
            <article
              key={channelLabel}
              className="space-y-3 rounded-2xl border border-zinc-200/70 bg-white/90 p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-300">
                  {channelLabel}
                </h3>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {templates.length} टेम्पलेट
                </span>
              </header>

              <div className="space-y-3">
                {templates.map((template) => {
                  const preview = fillTemplate(template, {
                    ...variables,
                    name: variables.name || "ग्राहक",
                    link: variables.link || "https://wishfin.com/apply",
                  });

                  const isActive = selectedTemplate?.id === template.id;

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleTemplateSelect(template)}
                      className={`group w-full rounded-2xl border px-4 py-3 text-left transition ${
                        isActive
                          ? "border-sky-500 bg-sky-50 shadow-lg shadow-sky-500/10 dark:border-sky-400 dark:bg-sky-500/10"
                          : "border-zinc-200 bg-white hover:border-sky-200 hover:bg-sky-50/40 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-sky-500/40 dark:hover:bg-sky-500/10"
                      }`}
                    >
                      <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-sky-700 dark:text-zinc-100 dark:group-hover:text-sky-300">
                        {template.title}
                      </h4>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {template.description}
                      </p>
                      <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-zinc-100/80 px-3 py-2 text-xs text-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-200">
                        {preview}
                      </pre>
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


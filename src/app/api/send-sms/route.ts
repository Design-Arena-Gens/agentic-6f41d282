import { NextResponse } from "next/server";
import twilio from "twilio";

import { fillTemplate, getTemplateById } from "@/config/messages";

interface SendMessagePayload {
  phone: string;
  templateId: string;
  variables?: Record<string, string>;
  preview?: boolean;
}

function parsePayload(body: unknown): SendMessagePayload {
  if (!body || typeof body !== "object") {
    throw new Error("अमान्य अनुरोध।");
  }

  const { phone, templateId, variables, preview } = body as Record<
    string,
    unknown
  >;

  if (!phone || typeof phone !== "string") {
    throw new Error("फोन नंबर आवश्यक है।");
  }
  if (!templateId || typeof templateId !== "string") {
    throw new Error("टेम्पलेट आईडी आवश्यक है।");
  }

  if (variables && typeof variables !== "object") {
    throw new Error("वेरिएबल मान अमान्य हैं।");
  }

  return {
    phone,
    templateId,
    variables:
      variables && typeof variables === "object"
        ? Object.entries(variables).reduce<Record<string, string>>(
            (acc, [key, value]) => {
              if (typeof value === "string") acc[key] = value;
              return acc;
            },
            {},
          )
        : undefined,
    preview: typeof preview === "boolean" ? preview : undefined,
  };
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const body = parsePayload(rawBody);

    const template = getTemplateById(body.templateId);

    if (!template || template.channel !== "sms") {
      return NextResponse.json(
        { message: "एसएमएस टेम्पलेट नहीं मिला।" },
        { status: 400 },
      );
    }

    const messageBody = fillTemplate(template, body.variables ?? {});

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_SMS_FROM;
    const previewOnly = body.preview || !accountSid || !authToken || !fromNumber;

    if (previewOnly) {
      return NextResponse.json({
        preview: true,
        previewBody: messageBody,
        message:
          "प्रीव्यू मोड सक्रिय है। उत्पादन में भेजने के लिए Twilio क्रेडेन्शियल सेट करें।",
      });
    }

    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body: messageBody,
      from: fromNumber,
      to: body.phone,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[send-sms] error", error);
    const message =
      error instanceof Error ? error.message : "एसएमएस भेजने में त्रुटि।";
    return NextResponse.json({ message }, { status: 500 });
  }
}

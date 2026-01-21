import { buildSystemPrompt, buildVisionPrompt } from "./AiPrompts";

export async function processText(
  ai: Ai,
  requerimiento: string,
  catalogoPrompt: string,
): Promise<{ response: string; textoInterpretado: string }> {
  const systemPrompt = buildSystemPrompt(catalogoPrompt);

  const response = await ai.run("@cf/qwen/qwen3-30b-a3b-fp8", {
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `El cliente solicita: "${requerimiento}"\n\nGenera la cotizacion en formato JSON usando SOLO productos del catalogo.`,
      },
    ],
    max_tokens: 1024,
    temperature: 0.3,
  });

  // Manejar diferentes formatos de respuesta de Cloudflare Workers AI
  let responseText = "";
  if (typeof response === "string") {
    responseText = response;
  } else if (response && typeof response === "object") {
    const resp = response as Record<string, unknown>;

    // Formato OpenAI-compatible (choices[0].message.content)
    if (
      resp.choices &&
      Array.isArray(resp.choices) &&
      resp.choices.length > 0
    ) {
      const firstChoice = resp.choices[0] as Record<string, unknown>;
      if (firstChoice.message && typeof firstChoice.message === "object") {
        const message = firstChoice.message as Record<string, unknown>;
        responseText = String(message.content ?? "");
      }
    }
    // Formato simple de Workers AI
    else if (resp.response) {
      responseText = String(resp.response);
    }
    // Otros formatos
    else {
      responseText = String(
        resp.text ?? resp.content ?? resp.result ?? JSON.stringify(response),
      );
    }
  }

  return {
    response: responseText,
    textoInterpretado: requerimiento,
  };
}

export async function processAudio(
  ai: Ai,
  audioBase64: string,
  catalogoPrompt: string,
): Promise<{ response: string; textoInterpretado: string }> {
  // Paso 1: Transcribir audio con Whisper
  const binaryString = atob(audioBase64);
  const audioBuffer = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    audioBuffer[i] = binaryString.charCodeAt(i);
  }

  const transcription = (await ai.run("@cf/openai/whisper", {
    audio: [...audioBuffer],
  })) as { text?: string };

  const textoTranscrito = transcription.text ?? "";

  // Paso 2: Procesar texto transcrito con modelo de texto
  const result = await processText(ai, textoTranscrito, catalogoPrompt);

  return {
    response: result.response,
    textoInterpretado: textoTranscrito,
  };
}

export async function processImage(
  ai: Ai,
  imageData: string,
  catalogoPrompt: string,
): Promise<{ response: string; textoInterpretado: string }> {
  // Asegurar formato data URI
  let imageUrl = imageData;
  if (!imageData.startsWith("data:")) {
    imageUrl = `data:image/jpeg;base64,${imageData}`;
  }

  const visionPrompt = buildVisionPrompt(catalogoPrompt);

  // Paso 1: Analizar imagen con modelo de vision
  const visionResponse = (await ai.run(
    "@cf/meta/llama-3.2-11b-vision-instruct",
    {
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: visionPrompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 512,
    },
  )) as { response?: string };

  const descripcionImagen = visionResponse.response ?? "";

  // Paso 2: Procesar descripcion con modelo de texto para cotizacion
  const result = await processText(ai, descripcionImagen, catalogoPrompt);

  return {
    response: result.response,
    textoInterpretado: descripcionImagen,
  };
}

import { Hono } from "hono";
import { cors } from "hono/cors";
import CATALOGO from "../examples/dataCatalog";
import { ErrorResponse, RequestData } from "../interfaces/main";
import { processText, processImage, processAudio } from "../utils/Procesadores";
import { getCatalogoParaPrompt } from "../utils/Auxiliares";
import { parseAIResponse } from "../utils/AiResponse";

type Bindings = {
  AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

// Configurar CORS para el frontend
app.use(
  "*",
  cors({
    origin: ["https://megamobilier-test-frontend.pages.dev", "http://localhost:3000"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/", (c) => {
  return c.json({
    status: "ok",
    service: "megamobilier-cotizacion",
    endpoints: {
      cotizar: "POST /cotizar",
      catalogo: "GET /catalogo",
    },
  });
});

// Endpoint para ver el catalogo
app.get("/catalogo", (c) => {
  return c.json({
    total: CATALOGO.length,
    categorias: [...new Set(CATALOGO.map((p) => p.categoria))],
    productos: CATALOGO,
  });
});

// Endpoint principal de cotizacion
app.post("/cotizar", async (c) => {
  try {
    // 1. Parsear y validar request
    const body = await c.req.json<RequestData>();

    if (!body.data) {
      return c.json<ErrorResponse>(
        {
          error: "INVALID_REQUEST",
          mensaje: 'El campo "data" es requerido',
        },
        400,
      );
    }

    const { nombre, requerimiento, formato, ingresoFecha, ciudad, email } =
      body.data;

    if (!nombre) {
      return c.json<ErrorResponse>(
        {
          error: "MISSING_FIELDS",
          mensaje: 'El campo "nombre" es requerido',
        },
        400,
      );
    }

    if (!requerimiento) {
      return c.json<ErrorResponse>(
        {
          error: "MISSING_FIELDS",
          mensaje: 'El campo "requerimiento" es requerido',
        },
        400,
      );
    }

    if (!formato || !["text", "audio", "image"].includes(formato)) {
      return c.json<ErrorResponse>(
        {
          error: "INVALID_FORMAT",
          mensaje: 'El campo "formato" debe ser "text", "audio" o "image"',
        },
        400,
      );
    }

    // 2. Obtener catalogo para prompt
    const catalogoPrompt = getCatalogoParaPrompt();

    // 3. Procesar segun formato
    let aiResult: { response: string; textoInterpretado: string };

    switch (formato) {
      case "text":
        aiResult = await processText(c.env.AI, requerimiento, catalogoPrompt);
        break;

      case "audio":
        aiResult = await processAudio(c.env.AI, requerimiento, catalogoPrompt);
        break;

      case "image":
        aiResult = await processImage(c.env.AI, requerimiento, catalogoPrompt);
        break;

      default:
        throw new Error("Formato no soportado");
    }

    // 4. Parsear y validar respuesta de IA
    const fechaFormateada = new Date(
      ingresoFecha || Date.now(),
    ).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const cotizacion = parseAIResponse(
      aiResult.response,
      nombre,
      fechaFormateada,
      formato,
      aiResult.textoInterpretado,
    );

    const isProduction = !c.req.url.includes("localhost");

    if (isProduction) {
      const n8nPayload = {
        data: {
          nombre: cotizacion.cliente || "No indicado",
          ingresoFecha: cotizacion.fecha,
          requerimiento: cotizacion.debug.textoInterpretado,
          formato: cotizacion.debug.formatoProcesado,
          estado: "procesado",
          ciudad: ciudad || "No indicado",
          email: email || "No indicado",
        },
      };

      c.executionCtx.waitUntil(
        fetch(
          "http://automation-n8nwithpostgres-491e65-86-48-21-187.traefik.me/webhook/megamobilier",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(n8nPayload),
          },
        )
          .then((res) => console.log("n8n status:", res.status))
          .catch((err) => console.log("n8n error:", err)),
      );
    } else {
      console.log("n8n webhook omitido en desarrollo local");
    }

    return c.json(cotizacion);
  } catch (error) {
    console.error("Error procesando cotizacion:", error);

    return c.json<ErrorResponse>(
      {
        error: "PROCESSING_ERROR",
        mensaje: "Error procesando la solicitud de cotizacion",
        detalles: error instanceof Error ? error.message : "Error desconocido",
      },
      500,
    );
  }
});

export default app;

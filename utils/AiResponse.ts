import CATALOGO from "../examples/dataCatalog";
import { AIQuoteResponse, CotizacionItem, CotizacionResponse } from "../interfaces/main";


const IVA_PORCENTAJE = 0.15;

export function parseAIResponse(
  aiResponse: string,
  clienteNombre: string,
  fecha: string,
  formato: string,
  textoInterpretado: string,
): CotizacionResponse {
  // Si la respuesta está vacía, retornar cotización vacía
  if (!aiResponse || aiResponse.trim() === "") {
    return {
      cliente: clienteNombre,
      fecha: fecha,
      items: [],
      subtotal: 0,
      iva: 0,
      total: 0,
      debug: {
        formatoProcesado: formato,
        textoInterpretado: textoInterpretado,
        rawResponse: "Respuesta vacía de la IA",
      } as CotizacionResponse["debug"] & { rawResponse: string },
    };
  }

  // Limpiar respuesta - remover texto antes/despues del JSON y posibles backticks
  let cleanResponse = aiResponse
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/\\boxed\{[\s\S]*?\}/gi, "")
    .trim();

  // Intentar extraer JSON de diferentes formas
  let jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);

  // Si no encontramos JSON, intentar buscar un array
  if (!jsonMatch) {
    const arrayMatch = cleanResponse.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      // Envolver array en objeto
      jsonMatch = [`{"items": ${arrayMatch[0]}}`] as RegExpMatchArray;
    }
  }

  if (!jsonMatch) {
    throw new Error(
      `No se encontro JSON valido. Respuesta raw: ${aiResponse.substring(0, 300)}`,
    );
  }

  let parsed: AIQuoteResponse;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error(
      `Error parseando JSON: ${jsonMatch[0].substring(0, 200)}...`,
    );
  }

  // Si parsed.items no existe, buscar en otras propiedades comunes
  if (!parsed.items) {
    const parsedAny = parsed as unknown as Record<string, unknown>;
    const possibleItems =
      parsedAny.productos || parsedAny.cotizacion || parsedAny.lista;
    if (Array.isArray(possibleItems)) {
      parsed.items = possibleItems as AIQuoteResponse["items"];
    }
  }

  if (!parsed.items || !Array.isArray(parsed.items)) {
    throw new Error(
      `La respuesta no contiene items. Estructura: ${JSON.stringify(parsed).substring(0, 200)}`,
    );
  }

  // Validar y recalcular items
  const validatedItems: CotizacionItem[] = [];
  let subtotalCalculado = 0;

  for (const item of parsed.items) {
    // Buscar producto en catalogo (match flexible)
    const productoEncontrado = CATALOGO.find(
      (p) =>
        p.nombre.toLowerCase() === item.nombre.toLowerCase() ||
        p.nombre.toLowerCase().includes(item.nombre.toLowerCase()) ||
        item.nombre.toLowerCase().includes(p.nombre.toLowerCase()),
    );

    const precioReal = productoEncontrado?.precio ?? item.precioUnitario;
    const cantidad = Math.max(1, Math.round(item.cantidad || 1));
    const subtotalItem = cantidad * precioReal;

    validatedItems.push({
      nombre: productoEncontrado?.nombre ?? item.nombre,
      cantidad,
      precioUnitario: precioReal,
      subtotal: Math.round(subtotalItem * 100) / 100,
    });

    subtotalCalculado += subtotalItem;
  }

  // Recalcular totales
  subtotalCalculado = Math.round(subtotalCalculado * 100) / 100;
  const ivaCalculado =
    Math.round(subtotalCalculado * IVA_PORCENTAJE * 100) / 100;
  const totalCalculado =
    Math.round((subtotalCalculado + ivaCalculado) * 100) / 100;

  return {
    cliente: clienteNombre,
    fecha: fecha,
    items: validatedItems,
    subtotal: subtotalCalculado,
    iva: ivaCalculado,
    total: totalCalculado,
    debug: {
      formatoProcesado: formato,
      textoInterpretado: textoInterpretado,
    },
  };
}
export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
}

export interface RequestData {
  data: {
    ingresoFecha: string;
    nombre: string;
    email: string;
    ciudad: string;
    requerimiento: string;
    formato: "text" | "audio" | "image";
    estado: string;
  };
}

export interface CotizacionItem {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CotizacionResponse {
  cliente: string;
  fecha: string;
  items: CotizacionItem[];
  subtotal: number;
  iva: number;
  total: number;
  debug: {
    formatoProcesado: string;
    textoInterpretado: string;
  };
}

export interface ErrorResponse {
  error: string;
  mensaje: string;
  detalles?: string;
}


export interface AIQuoteResponse {
  items: Array<{
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
  notas?: string;
}

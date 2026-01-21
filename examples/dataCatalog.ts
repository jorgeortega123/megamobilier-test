import { Producto } from "../interfaces/main";

const CATALOGO: Producto[] = [
  // MOBILIARIO HOSPITALARIO
  {
    id: "HOS-001",
    nombre: "Cama hospitalaria electrica",
    categoria: "Mobiliario Hospitalario",
    precio: 2500.0,
  },
  {
    id: "HOS-002",
    nombre: "Cama hospitalaria manual",
    categoria: "Mobiliario Hospitalario",
    precio: 1200.0,
  },
  {
    id: "HOS-003",
    nombre: "Mesa auxiliar hospitalaria",
    categoria: "Mobiliario Hospitalario",
    precio: 180.0,
  },
  {
    id: "HOS-004",
    nombre: "Silla de ruedas estandar",
    categoria: "Mobiliario Hospitalario",
    precio: 350.0,
  },
  {
    id: "HOS-005",
    nombre: "Biombo hospitalario 3 cuerpos",
    categoria: "Mobiliario Hospitalario",
    precio: 280.0,
  },
  {
    id: "HOS-006",
    nombre: "Carro de curaciones",
    categoria: "Mobiliario Hospitalario",
    precio: 450.0,
  },

  // MOBILIARIO OFICINAS
  {
    id: "OFI-001",
    nombre: "Escritorio ejecutivo L",
    categoria: "Mobiliario Oficinas",
    precio: 650.0,
  },
  {
    id: "OFI-002",
    nombre: "Escritorio operativo",
    categoria: "Mobiliario Oficinas",
    precio: 320.0,
  },
  {
    id: "OFI-003",
    nombre: "Silla ejecutiva ergonomica",
    categoria: "Mobiliario Oficinas",
    precio: 420.0,
  },
  {
    id: "OFI-004",
    nombre: "Silla operativa malla",
    categoria: "Mobiliario Oficinas",
    precio: 180.0,
  },
  {
    id: "OFI-005",
    nombre: "Archivador metalico 4 gavetas",
    categoria: "Mobiliario Oficinas",
    precio: 280.0,
  },
  {
    id: "OFI-006",
    nombre: "Estacion de trabajo modular",
    categoria: "Mobiliario Oficinas",
    precio: 550.0,
  },
  {
    id: "OFI-007",
    nombre: "Mesa de reuniones 8 personas",
    categoria: "Mobiliario Oficinas",
    precio: 890.0,
  },

  // LONAS TENSADAS
  {
    id: "LON-001",
    nombre: "Lona tensada parasol 3x3m",
    categoria: "Lonas Tensadas",
    precio: 450.0,
  },
  {
    id: "LON-002",
    nombre: "Lona tensada parasol 4x4m",
    categoria: "Lonas Tensadas",
    precio: 680.0,
  },
  {
    id: "LON-003",
    nombre: "Lona tensada decorativa 5x5m",
    categoria: "Lonas Tensadas",
    precio: 950.0,
  },
  {
    id: "LON-004",
    nombre: "Estructura metalica para lona",
    categoria: "Lonas Tensadas",
    precio: 380.0,
  },
  {
    id: "LON-005",
    nombre: "Instalacion lona tensada",
    categoria: "Lonas Tensadas",
    precio: 200.0,
  },

  // UNIFORMES INDUSTRIALES
  {
    id: "UNI-001",
    nombre: "Overol industrial tela drill",
    categoria: "Uniformes Industriales",
    precio: 45.0,
  },
  {
    id: "UNI-002",
    nombre: "Camisa industrial manga larga",
    categoria: "Uniformes Industriales",
    precio: 28.0,
  },
  {
    id: "UNI-003",
    nombre: "Pantalon industrial cargo",
    categoria: "Uniformes Industriales",
    precio: 32.0,
  },
  {
    id: "UNI-004",
    nombre: "Chaleco reflectivo",
    categoria: "Uniformes Industriales",
    precio: 18.0,
  },
  {
    id: "UNI-005",
    nombre: "Casco de seguridad",
    categoria: "Uniformes Industriales",
    precio: 25.0,
  },
  {
    id: "UNI-006",
    nombre: "Botas de seguridad punta acero",
    categoria: "Uniformes Industriales",
    precio: 65.0,
  },
  {
    id: "UNI-007",
    nombre: "Mandil industrial",
    categoria: "Uniformes Industriales",
    precio: 22.0,
  },

  // PANELES SOLARES
  {
    id: "SOL-001",
    nombre: "Panel solar 550W monocristalino",
    categoria: "Paneles Solares",
    precio: 280.0,
  },
  {
    id: "SOL-002",
    nombre: "Panel solar 450W policristalino",
    categoria: "Paneles Solares",
    precio: 220.0,
  },
  {
    id: "SOL-003",
    nombre: "Inversor solar 5kW",
    categoria: "Paneles Solares",
    precio: 1200.0,
  },
  {
    id: "SOL-004",
    nombre: "Inversor solar 10kW",
    categoria: "Paneles Solares",
    precio: 2100.0,
  },
  {
    id: "SOL-005",
    nombre: "Bateria litio 5kWh",
    categoria: "Paneles Solares",
    precio: 1800.0,
  },
  {
    id: "SOL-006",
    nombre: "Estructura montaje techo",
    categoria: "Paneles Solares",
    precio: 150.0,
  },
  {
    id: "SOL-007",
    nombre: "Kit instalacion completo",
    categoria: "Paneles Solares",
    precio: 350.0,
  },

  // PANTALLAS INTERACTIVAS
  {
    id: "PAN-001",
    nombre: "Pantalla interactiva 65 pulgadas",
    categoria: "Pantallas Interactivas",
    precio: 2800.0,
  },
  {
    id: "PAN-002",
    nombre: "Pantalla interactiva 75 pulgadas",
    categoria: "Pantallas Interactivas",
    precio: 3500.0,
  },
  {
    id: "PAN-003",
    nombre: "Pantalla interactiva 86 pulgadas",
    categoria: "Pantallas Interactivas",
    precio: 4800.0,
  },
  {
    id: "PAN-004",
    nombre: "Soporte movil para pantalla",
    categoria: "Pantallas Interactivas",
    precio: 380.0,
  },
  {
    id: "PAN-005",
    nombre: "Soporte pared para pantalla",
    categoria: "Pantallas Interactivas",
    precio: 180.0,
  },
  {
    id: "PAN-006",
    nombre: "OPS (PC integrado) i5",
    categoria: "Pantallas Interactivas",
    precio: 650.0,
  },
  {
    id: "PAN-007",
    nombre: "OPS (PC integrado) i7",
    categoria: "Pantallas Interactivas",
    precio: 950.0,
  },
];

export default CATALOGO;

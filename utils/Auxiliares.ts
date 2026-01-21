import CATALOGO from "../examples/dataCatalog";

export function getCatalogoParaPrompt(): string {
  return CATALOGO.map(
    (p) =>
      `- ${p.nombre} (ID: ${p.id}, Categoria: ${p.categoria}): $${p.precio.toFixed(2)}`,
  ).join("\n");
}

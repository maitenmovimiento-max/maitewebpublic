import Link from "next/link";
import { Flower2 } from "lucide-react";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link className={`brand${light ? " brand--light" : ""}`} href="/" aria-label="MaitenMovimiento, inicio">
      <span className="brand__mark" aria-hidden="true"><Flower2 size={19} strokeWidth={1.8} /></span>
      <span>maiten<strong>movimiento</strong></span>
    </Link>
  );
}

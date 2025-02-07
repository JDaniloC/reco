import Image from "next/image";
import { useRef } from "react";
import { DevedorAcordo } from "@/types/acordo.dto";

interface TenantProfileCardProps {
  tenant: DevedorAcordo;
}

export default function TenantProfileCard({ tenant }: TenantProfileCardProps) {
  const linkRef = useRef<HTMLSpanElement>(null);

  function handleCopyLink() {
    if (!linkRef.current || typeof window === "undefined") return;
    const identifier = tenant.acordo.identificador;
    const urlOrigin = window.location.origin;
    navigator.clipboard.writeText(`${urlOrigin}/negociacao/${identifier}`);
    linkRef.current.textContent = "Link copiado!";
  }

  function handleButtonBlur() {
    if (!linkRef.current) return;
    linkRef.current.textContent = "Copiar link";
  }

  return (
    <div className="w-128 py-6 pl-10 pr-5 flex flex-col
                    justify-between rounded-2xl bg-white lg:h-full xl:h-40">
      <span className="text-xl font-medium">Perfil do inadimplente</span>
      <div className="flex items-center justify-between h-full">
        <div className="w-full flex flex-col justify-between">
          <span className="text-lg font-normal">{tenant.nome}</span>
          <div className="w-full flex justify-between flex-wrap lg:flex-nowrap">
            <div className="flex flex-col">
              <span className="text-sm font-light">
                <span className="font-normal">Condomínio:</span>&nbsp;
                {tenant.nomeCondominio}
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              onBlur={handleButtonBlur}
              className="h-8 px-3 self-end flex items-center justify-between
                         gap-2 bg-indigo-50 text-sm font-normal text-sky-600
                         rounded-md">
              <Image src="/icons/clip.svg" alt="clip" width={21} height={21} />
              <span ref={linkRef}>Copiar link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

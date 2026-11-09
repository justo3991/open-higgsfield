"use client";

import { useRef } from "react";
import { Clapperboard, ImagePlus, Layers3, Ruler } from "lucide-react";

interface OutputOption { value: string; label: string }
interface BriefProps {
    mode: "image" | "video";
    keyVisualName?: string;
    keyVisualAccepted: string | null;
    onKeyVisual: (file: File) => void;
    aspect: string;
    aspects: OutputOption[];
    onAspectChange: (ratio: string) => void;
    resolution: string;
    resolutions: OutputOption[];
    onResolutionChange: (resolution: string) => void;
    duration?: string | number;
    durations?: Array<string | number>;
    onDurationChange?: (duration: string) => void;
}

/** Production controls are mapped to the active model's actual capabilities.
 * Pixel dimensions, FPS, export codec and batch variations are intentionally
 * not advertised as generatable if the provider does not support them. */
export function ProductionBriefPanel({
    mode, keyVisualName, keyVisualAccepted, onKeyVisual, aspect, aspects,
    onAspectChange, resolution, resolutions, onResolutionChange,
    duration, durations, onDurationChange,
}: BriefProps) {
    const fileRef = useRef<HTMLInputElement>(null);
    const field = "block min-h-10 w-full rounded-lg border border-white/15 bg-[#171717] px-3 py-2 text-xs text-white outline-none focus:border-white/50";
    return <section aria-label="Briefing de produção" className="w-full rounded-2xl border border-white/10 bg-[#101010] p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-white"><Layers3 className="size-4"/> Briefing de produção WEDO</div>
            <span className="text-[11px] text-white/55">Key Visual → Dimensões → Produção</span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-2">
                <label className="block text-xs font-semibold text-white/85">01 · Key Visual principal</label>
                <input ref={fileRef} type="file" accept={keyVisualAccepted ?? "image/*,video/*"} className="sr-only"
                    aria-label="Carregar Key Visual principal"
                    onChange={event => { const file = event.target.files?.[0]; if (file) onKeyVisual(file); event.target.value = ""; }} />
                <button type="button" disabled={!keyVisualAccepted} onClick={() => fileRef.current?.click()}
                    className="flex min-h-11 w-full items-center gap-3 rounded-lg border border-dashed border-white/25 px-3 py-2 text-left text-xs text-white hover:border-white/60 disabled:cursor-not-allowed disabled:opacity-50">
                    {mode === "image" ? <ImagePlus className="size-5 shrink-0"/> : <Clapperboard className="size-5 shrink-0"/>}
                    <span className="min-w-0 truncate">{keyVisualName || (keyVisualAccepted ? "Seleccionar imagem ou vídeo de referência" : "O modelo seleccionado não aceita Key Visual")}</span>
                </button>
                <p className="text-[11px] text-white/50">{keyVisualAccepted
                    ? "O ficheiro será enviado no campo de referência suportado pelo modelo."
                    : "Escolha um modelo com suporte a imagens ou vídeos de referência."}</p>
            </div>
            <div className="space-y-2">
                <label className="flex items-center gap-1 text-xs font-semibold text-white/85"><Ruler className="size-3.5"/> 02 · Tamanho / proporção</label>
                <select className={field} value={aspect} disabled={!aspects.length}
                    onChange={event => onAspectChange(event.target.value)}
                    aria-label="Proporção da peça">
                    {aspects.length ? aspects.map(option => <option key={option.value} value={option.value}>{option.label}</option>)
                        : <option value="">Não configurável neste modelo</option>}
                </select>
                <p className="text-[11px] text-white/50">As dimensões finais em píxeis dependem da resolução nativa do modelo. A adaptação exacta pode exigir pós-produção.</p>
            </div>
            <div className="space-y-2">
                <label className="block text-xs font-semibold text-white/85">03 · Resolução de geração</label>
                <select className={field} value={resolution} disabled={!resolutions.length}
                    onChange={event => onResolutionChange(event.target.value)}
                    aria-label="Resolução de geração">
                    {resolutions.length ? resolutions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)
                        : <option value="">Definida pelo modelo</option>}
                </select>
                <p className="text-[11px] text-white/50">Só são apresentadas resoluções disponibilizadas pelo fornecedor.</p>
            </div>
            <div className="space-y-2">
                <label className="block text-xs font-semibold text-white/85">{mode === "video" ? "04 · Duração do vídeo" : "04 · Formato de entrega"}</label>
                {mode === "video" ? <select className={field} value={duration === undefined ? "" : String(duration)} disabled={!durations?.length}
                    onChange={event => onDurationChange?.(event.target.value)} aria-label="Duração do vídeo">
                    {durations?.length ? durations.map(item => <option key={String(item)} value={String(item)}>{String(item)} segundos</option>)
                        : <option value="">Definida pelo modelo</option>}
                </select> : <div className="flex min-h-10 items-center rounded-lg border border-white/15 px-3 text-xs text-white/80">Imagem · ficheiro disponibilizado pelo fornecedor</div>}
                <p className="text-[11px] text-white/50">{mode === "video"
                    ? "FPS, codec e exportação final dependem do fornecedor e da pós-produção."
                    : "PNG, JPG, WebP e tamanhos exactos serão tratados numa fase de exportação."}</p>
            </div>
        </div>
    </section>;
}

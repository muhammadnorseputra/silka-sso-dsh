"use client";

import { Button, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";

interface LoadingScreenProps {
  /** Nama portal/tujuan redirect, mis. "SiapKerja" */
  portalName?: string;
  /** Teks judul utama */
  title?: string;
  /** Logo instansi/brand (opsional, ganti sesuai kebutuhan) */
  poweredByLabel?: string;
  /** URL tujuan redirect */
  redirectUrl: string;
  /** Jeda sebelum redirect (ms) */
  redirectDelay?: number;
  /** Batas waktu sebelum dianggap redirect bermasalah (ms) */
  timeoutMs?: number;
}

/**
 * LoadingScreen
 * Layar transisi "tunggu sebentar" saat melanjutkan proses login/SSO
 * ke portal lain. Dibangun dengan Tailwind CSS v4 + HeroUI v2.8.
 */
export default function LoadingScreen({
  portalName = "SSO-Portal",
  title = "Tunggu sebentar",
  poweredByLabel = "by",
  redirectUrl,
  redirectDelay = 3000,
  timeoutMs = 8000,
}: LoadingScreenProps) {
  const router = useRouter();
  const [hasIssue, setHasIssue] = React.useState(false);
  const redirectTriggeredRef = React.useRef(false);

  React.useEffect(() => {
    const redirectTimer = setTimeout(() => {
      redirectTriggeredRef.current = true;
      router.replace(redirectUrl);
    }, redirectDelay);
 
    // Jika setelah redirect ditrigger halaman ini masih tampil melewati
    // timeoutMs, kemungkinan redirect gagal (mis. blokir popup/jaringan
    // putus) — tampilkan opsi refresh manual ke pengguna.
    const issueTimer = setTimeout(() => {
      if (redirectTriggeredRef.current) {
        setHasIssue(true);
      }
    }, timeoutMs);
 
    return () => {
      clearTimeout(redirectTimer);
      clearTimeout(issueTimer);
    };
  }, [router, redirectUrl, redirectDelay, timeoutMs]);
 
  const handleRetry = () => {
    setHasIssue(false);
    redirectTriggeredRef.current = false;
    router.replace(redirectUrl);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      {/* Decorative background shapes — dibuat lebih halus & modern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-[12%] top-[6%] h-44 w-44 -rotate-6 rounded-3xl border border-blue-100 bg-blue-50/60" />
        <div className="absolute left-[22%] top-[2%] h-36 w-44 rotate-3 rounded-3xl border border-blue-100/80 bg-white/40" />
        <div className="absolute bottom-[8%] right-[14%] h-40 w-44 rotate-6 rounded-3xl border border-dashed border-blue-200 bg-transparent" />
        <div className="absolute bottom-[4%] right-[20%] h-36 w-40 -rotate-3 rounded-3xl border border-blue-100/80 bg-blue-50/50" />
      </div>

      {/* Card utama */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/90 p-10 text-center shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-12">
        {/* Spinner HeroUI */}
        <div className="mb-7 flex justify-center">
          <Spinner
            size="lg"
            classNames={{
              circle1: "border-b-blue-600",
              circle2: "border-b-blue-600",
            }}
          />
        </div>

        {/* Judul */}
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[26px]">
          {title}
        </h1>

        {/* Deskripsi */}
        <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-slate-500">
          Sedang melanjutkan proses login ke portal{" "}
          <span className="font-bold text-slate-700">{portalName}</span>
        </p>

        {/* Notifikasi jika redirect bermasalah */}
        {hasIssue && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-left">
            <p className="text-sm font-medium text-amber-900">
              Proses ini memakan waktu lebih lama dari biasanya
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-amber-700">
              Periksa koneksi internet Anda, lalu coba lagi.
            </p>
            <Button
              onPress={handleRetry}
              size="sm"
              radius="lg"
              className="mt-3 w-full bg-amber-600 font-medium text-white data-[hover=true]:bg-amber-700"
            >
              Muat ulang
            </Button>
          </div>
        )}

        {/* Divider "by" */}
        <div className="my-8 flex items-center gap-4">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {poweredByLabel}
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Logo instansi */}
        <div className="flex items-center justify-center gap-3">
          <KemnakerLogo className="h-9 w-9 shrink-0 text-blue-900" />
          <div className="text-left leading-[1.15]">
            <p className="text-[11px] font-bold tracking-wide text-blue-950 sm:text-xs">
              PEMERINTAH
            </p>
            <p className="text-[11px] font-bold tracking-wide text-blue-950 sm:text-xs">
              KABUPATEN BALANGAN
            </p>
            <p className="text-[11px] font-bold tracking-wide text-blue-950 sm:text-xs">
              BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Logo "pinwheel" Kemnaker disederhanakan jadi SVG vektor
 * agar tajam di semua resolusi (ganti dengan aset resmi bila tersedia).
 */
function KemnakerLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <g>
        {[0, 90, 180, 270].map((rotation) => (
          <g key={rotation} transform={`rotate(${rotation} 50 50)`}>
            <path d="M50 50 L62 12 A14 14 0 1 1 38 12 Z" />
          </g>
        ))}
        <circle cx="50" cy="50" r="9" />
      </g>
    </svg>
  );
}

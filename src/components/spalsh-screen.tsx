"use client";

import { Button, Spinner } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface LoadingScreenProps {
  /** Nama portal/tujuan redirect, mis. "SiapKerja" */
  portalName?: string;
  /** Teks judul utama */
  title?: string;
  /** Label pembagi di bawah card */
  poweredByLabel?: string;
  /** URL tujuan redirect */
  redirectUrl: string;
  /** Jeda sebelum redirect (ms) */
  redirectDelay?: number;
  /** Batas waktu sebelum dianggap redirect bermasalah (ms) */
  timeoutMs?: number;
}

const DEFAULTS = {
  portalName: "SSO-Portal",
  title: "Tunggu sebentar",
  poweredByLabel: "by",
  redirectDelay: 2000,
  timeoutMs: 8000,
} as const;

/**
 * LoadingScreen
 * Menampilkan layar transisi saat proses redirect ke portal lain sedang berlangsung.
 */
export default function LoadingScreen({
  portalName = DEFAULTS.portalName,
  title = DEFAULTS.title,
  poweredByLabel = DEFAULTS.poweredByLabel,
  redirectUrl,
  redirectDelay = DEFAULTS.redirectDelay,
  timeoutMs = DEFAULTS.timeoutMs,
}: LoadingScreenProps) {
  const router = useRouter();
  const [hasIssue, setHasIssue] = useState(false);
  const redirectTriggeredRef = useRef(false);

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      redirectTriggeredRef.current = true;
      router.replace(redirectUrl);
    }, redirectDelay);

    const issueTimer = window.setTimeout(() => {
      if (redirectTriggeredRef.current) {
        setHasIssue(true);
      }
    }, timeoutMs);

    return () => {
      window.clearTimeout(redirectTimer);
      window.clearTimeout(issueTimer);
    };
  }, [redirectUrl, redirectDelay, timeoutMs, router]);

  const handleRetry = () => {
    setHasIssue(false);
    redirectTriggeredRef.current = false;
    router.replace(redirectUrl);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-b from-slate-50 to-slate-100 px-4">
      <DecorativeBackground />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/90 p-10 text-center shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-12">
        <div className="mb-7 flex justify-center" role="status" aria-live="polite">
          <Spinner
            size="lg"
            classNames={{
              circle1: "border-b-blue-600",
              circle2: "border-b-blue-400",
            }}
          />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[26px]">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-slate-500">
          Sedang melanjutkan proses login ke portal{" "}
          <span className="font-bold text-slate-700">{portalName}</span>
        </p>

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

        <div className="my-8 flex items-center gap-4">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {poweredByLabel}
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <PortalBranding />
      </div>
    </div>
  );
}

function DecorativeBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[12%] top-[6%] h-44 w-44 -rotate-6 rounded-3xl border border-blue-100 bg-blue-50/60" />
      <div className="absolute left-[22%] top-[2%] h-36 w-44 rotate-3 rounded-3xl border border-blue-100/80 bg-white/40" />
      <div className="absolute bottom-[8%] right-[14%] h-40 w-44 rotate-6 rounded-3xl border border-dashed border-blue-200 bg-transparent" />
      <div className="absolute bottom-[4%] right-[20%] h-36 w-40 -rotate-3 rounded-3xl border border-blue-100/80 bg-blue-50/50" />
    </div>
  );
}

function PortalBranding() {
  return (
    <div className="flex items-center justify-center gap-3">
      <BalanganLogo />
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
  );
}

function BalanganLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Logo Balangan"
      width={40}
      height={80}
      className={className}
    />
  );
}

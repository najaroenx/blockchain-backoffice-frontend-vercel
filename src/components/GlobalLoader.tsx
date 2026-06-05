"use client";
import { BeatLoader } from "react-spinners";
import { useLoading } from "@/contexts/LoadingContext";

export function GlobalLoader() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <BeatLoader loading={isLoading} color="#FF8901" size={20} />
    </div>
  );
}

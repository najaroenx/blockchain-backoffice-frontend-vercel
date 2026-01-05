import { EditButton, useRecordContext } from "react-admin";
import Image from "next/image";
import { ShowPointDialog, type PointDetails } from "./ShowPointDialog";
import { useCallback, useMemo } from "react";
import { useDialog } from "@/hooks/useDialog";
import { DEFAULT_POINT_IMAGE } from "./constants";

interface Props {
  id: string;
  name: string;
  contractAddress: string;
}

const resolveContractAddress = (value: unknown): string | null => {
  if (!value) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  const toByte = (input: unknown): number | null => {
    if (typeof input === "number" && Number.isFinite(input)) {
      return input;
    }
    if (typeof input === "string" && input.length > 0) {
      const parsed = Number(input);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  };

  if (Array.isArray(value)) {
    const bytes = value.map(toByte).filter((byte): byte is number => byte !== null);
    if (!bytes.length) return null;
    return (
      "0x" +
      bytes
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
        .toLowerCase()
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !Number.isNaN(Number(key)))
      .sort((a, b) => Number(a[0]) - Number(b[0]));
    if (!entries.length) return null;

    const bytes = entries
      .map(([, raw]) => toByte(raw))
      .filter((byte): byte is number => byte !== null);

    if (!bytes.length) return null;

    return (
      "0x" +
      bytes
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
        .toLowerCase()
    );
  }

  return null;
};

export const PointCard: React.FC<Props> = ({ name, contractAddress, id }) => {
  const [open, handleToggle] = useDialog();

  const record = useRecordContext();

  const handleClick = useCallback(() => {
    handleToggle();
  }, [handleToggle]);

  const imageSrc =
    typeof record?.imageUrl === "string" && record.imageUrl.length > 0
      ? record.imageUrl
      : DEFAULT_POINT_IMAGE;
  const tokenSymbol =
    typeof record?.symbol === "string" && record.symbol.length > 0
      ? record.symbol.toUpperCase()
      : undefined;

  const pointDetails: PointDetails = useMemo(() => {
    const contract =
      resolveContractAddress(record?.contractAddress) ??
      resolveContractAddress(contractAddress);
    const baseId = record?.id ?? id;
    const normalizedId =
      typeof baseId === "string"
        ? baseId
        : baseId !== undefined && baseId !== null
          ? String(baseId)
          : id;

    return {
      id: normalizedId,
      name: record?.name ?? name,
      symbol: record?.symbol,
      contractAddress: contract ?? null,
      initialSupply: record?.initialSupply,
      decimal: record?.decimal,
      frameSize: record?.frameSize,
      slotSize: record?.slotSize ?? null,
      merchantId: record?.merchantId,
      createdAt: record?.createdAt,
      updatedAt: record?.updatedAt,
    };
  }, [record, id, name, contractAddress]);

  return (
    <div className="bg-white p-4 rounded-lg max-w-md shadow-lg">
      <div className="relative w-full h-48 overflow-hidden rounded-lg">
        <Image
          src={imageSrc}
          alt={name}
          width={48}
          height={48}
          className="w-full h-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = DEFAULT_POINT_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-80 rounded-lg"></div>
      </div>

      <div className="pt-4">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold text-lg">{name}</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 2a10 10 0 0110 10v10H2V12A10 10 0 0112 2zm5.707 7.293a1 1 0 00-1.414 0L10 15.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {tokenSymbol && (
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500">
            {tokenSymbol}
          </p>
        )}

        <p className="block font-sans text-sm font-normal text-gray-700 opacity-75 overflow-hidden text-ellipsis whitespace-nowrap">
          ID : {id}
        </p>

        <div className="flex flex-col md:flex-row mt-5 gap-2 pt-0 ">

          <button
            onClick={handleClick}
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full bg-[#FF8901] hover:bg-[#fbbf7a] text-white shadow-none"
          >
            Show Point
          </button>
        </div>
        <ShowPointDialog
          open={open}
          onClose={handleToggle}
          point={pointDetails}
        />
      </div>
    </div>
  );
};

"use client";
import React, { useState, useEffect } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useApiWithLoading } from "@/app/dlt/hooks/useApiWithLoading";
import { useMerchantId } from "@/app/dlt/contexts/merchantContext";
import { api } from "@/libs/api";

interface ApiKey {
  id: string;
  apiKey: string;
  name: string;
  secretKey: string;
  createdAt: string;
  lastUsed: string | null;
  status: "active" | "revoked";
  permissions: string[];
}

export default function ApiKeyListPage() {
  const merchantId = useMerchantId();
  const { execute } = useApiWithLoading();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  // Fetch API keys on mount
  useEffect(() => {
    if (!merchantId) return;

    const fetchApiKeys = async () => {
      const data = await execute(
        () => api(`/api/${merchantId}/api-key`, { method: "GET" }),
        {
          loadingText: "กำลังโหลด API Keys...",
          showSuccessOnComplete: false,
        }
      );
      if (data && Array.isArray(data)) {
        setApiKeys(data);
      }
    };
    fetchApiKeys();
  }, [merchantId]);

  console.log("apiKeys", apiKeys);

  const toggleVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const maskSecretKey = (key: string): string => {
    if (!key || key.length < 11) return key;
    return (
      key.substring(0, 7) + "••••••••••••••••" + key.substring(key.length - 4)
    );
  };

  const revokeKey = (id: string) => {
    setApiKeys((prev) =>
      prev.map((key) =>
        key.id === id ? { ...key, status: "revoked" as const } : key
      )
    );
  };

  const deleteKey = async (id: string) => {
    if (!merchantId) return;

    try {
      await execute(
        () => api(`/api/${merchantId}/api-key/${id}`, { method: "DELETE" }),
        {
          loadingText: "กำลังลบ API Key...",
          successText: "ลบ API Key สำเร็จ!",
          errorText: "ไม่สามารถลบ API Key ได้",
        }
      );
      setApiKeys((prev) => prev.filter((key) => key.id !== id));
    } catch (error) {
      console.error("Failed to delete API key:", error);
    }
  };

  const createNewKey = async () => {
    if (!newKeyName.trim() || !merchantId) return;

    try {
      const result = await execute(
        () =>
          api(`/api/${merchantId}/api-key`, {
            method: "POST",
            body: { name: newKeyName },
          }),
        {
          loadingText: "กำลังสร้าง API Key...",
          successText: "สร้าง API Key สำเร็จ!",
          errorText: "ไม่สามารถสร้าง API Key ได้",
        }
      );

      // Refresh the list after creating
      const data = await api(`/api/${merchantId}/api-key`, { method: "GET" });
      if (data && Array.isArray(data)) {
        setApiKeys(data);
      }

      setNewKeyName("");
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create API key:", error);
    }
  };

  const activeKeys = apiKeys.filter((k) => k.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white dlt-heading">
            API Keys
          </h1>
          <p className="text-gray-400 mt-1">
            จัดการ Secret Keys สำหรับ Developer
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-500/25"
        >
          <AddIcon className="w-5 h-5" />
          Create New Key
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <VpnKeyIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Keys</p>
              <h3 className="text-2xl font-bold text-white">
                {apiKeys.length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Keys</p>
              <h3 className="text-2xl font-bold text-emerald-400">
                {activeKeys}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <WarningAmberIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Revoked Keys</p>
              <h3 className="text-2xl font-bold text-amber-400">
                {apiKeys.length - activeKeys}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <WarningAmberIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-400 font-medium text-sm">Security Notice</p>
          <p className="text-amber-400/70 text-sm mt-1">
            Secret keys ให้สิทธิ์เข้าถึง API ของคุณ
            กรุณาเก็บรักษาไว้อย่างปลอดภัย อย่าแชร์หรือ commit ลง version control
          </p>
        </div>
      </div>

      {/* API Keys Table */}
      <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Secret Key
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Last Used
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {apiKeys.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    ยังไม่มี API Key
                  </td>
                </tr>
              ) : (
                apiKeys.map((apiKey) => (
                  <tr
                    key={apiKey.id}
                    className={`hover:bg-white/5 transition-colors ${
                      apiKey.status === "revoked" ? "opacity-60" : ""
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          <VpnKeyIcon className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {apiKey.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg">
                          {visibleKeys.has(apiKey.id)
                            ? apiKey.apiKey
                            : maskSecretKey(apiKey.apiKey)}
                        </code>
                        <button
                          onClick={() => toggleVisibility(apiKey.id)}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title={visibleKeys.has(apiKey.id) ? "Hide" : "Show"}
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <VisibilityOffIcon className="w-4 h-4" />
                          ) : (
                            <VisibilityIcon className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            copyToClipboard(apiKey.secretKey, apiKey.id)
                          }
                          className={`p-1.5 rounded-lg transition-colors ${
                            copiedId === apiKey.id
                              ? "text-emerald-400 bg-emerald-500/20"
                              : "text-gray-400 hover:text-white hover:bg-white/10"
                          }`}
                          title="Copy"
                        >
                          {copiedId === apiKey.id ? (
                            <CheckCircleIcon className="w-4 h-4" />
                          ) : (
                            <ContentCopyIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(apiKey.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {apiKey.lastUsed
                        ? new Date(apiKey.lastUsed).toLocaleDateString(
                            "th-TH",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "Never"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          apiKey.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {apiKey.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {apiKey.status === "active" && (
                          <button
                            onClick={() => revokeKey(apiKey.id)}
                            className="px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors"
                          >
                            Revoke
                          </button>
                        )}
                        <button
                          onClick={() => deleteKey(apiKey.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <DeleteOutlineIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e] rounded-2xl border border-white/10 p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              Create New API Key
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              สร้าง API Key ใหม่สำหรับเข้าถึง API ของคุณ Key
              จะแสดงเพียงครั้งเดียว กรุณาบันทึกไว้
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Key Name
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production API Key"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewKey}
                disabled={!newKeyName.trim()}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                  newKeyName.trim()
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    : "bg-white/10 text-gray-500 cursor-not-allowed"
                }`}
              >
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

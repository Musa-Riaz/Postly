import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

export interface SocialAccount {
  id: string;
  platform: string;
  handle: string;
  displayName: string;
  avatarUrl?: string;
  isActive: boolean;
}

export function useAccounts() {
  return useQuery<SocialAccount[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data } = await apiClient.get("/accounts");
      return data;
    },
  });
}

export function useConnectPlatform() {
  return useMutation({
    mutationFn: async ({ platform, redirectUri }: { platform: string; redirectUri: string }) => {
      const { data } = await apiClient.post("/accounts/connect", { platform, redirectUri });
      return data.url as string;
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to initiate connection");
    },
  });
}

export function useDisconnectAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (accountId: string) => {
      await apiClient.delete(`/accounts/${accountId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account disconnected successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to disconnect account");
    },
  });
}

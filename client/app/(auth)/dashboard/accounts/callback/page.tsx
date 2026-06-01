"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/lib/api-client"
import { Button } from "@/components/ui/button"

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const hasCalled = useRef(false)

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async () => {
      // In Standard mode, Zernio has already connected the account.
      // We just notify our backend to sync the accounts for the profile.
      const { data } = await apiClient.post("/accounts/callback", {})
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      setTimeout(() => {
        router.push("/dashboard/accounts")
      }, 2000)
    },
  })

  useEffect(() => {
    const code = searchParams.get("code") // Headless mode
    const connected = searchParams.get("connected") // Standard mode
    
    if ((code || connected) && !hasCalled.current) {
      hasCalled.current = true
      mutate()
    } else if (!code && !connected) {
        router.push("/dashboard/accounts")
    }
  }, [searchParams, mutate, router])

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-md border-border shadow-shadow">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl uppercase tracking-tighter">
            {isPending && "Connecting Account..."}
            {isSuccess && "Success!"}
            {isError && "Connection Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 py-10">
          {isPending && (
            <>
              <div className="h-16 w-16 border-4 border-black border-t-main rounded-full animate-spin" />
              <p className="font-bold text-muted-foreground">Finalizing secure connection with Zernio...</p>
            </>
          )}

          {isSuccess && (
            <>
              <div className="bg-main p-4 border-2 border-black rounded-base animate-bounce">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <p className="font-bold text-center">Your account is connected! Redirecting you back to your dashboard...</p>
            </>
          )}

          {isError && (
            <>
              <div className="bg-coral p-4 border-2 border-black rounded-base">
                <AlertCircle className="h-12 w-12" />
              </div>
              <p className="font-bold text-center text-coral">
                {(error as any)?.response?.data?.message || "Something went wrong during the connection process."}
              </p>
              <Button 
                variant="neutral" 
                className="mt-4 font-heading uppercase"
                onClick={() => router.push("/dashboard/accounts")}
              >
                Back to Accounts
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

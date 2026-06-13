import { Suspense } from "react";
import ComposerClient from "./ComposerClient";
import { Loader2 } from 'lucide-react'

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading...
      </div>
    </div>}>
      <ComposerClient />
    </Suspense>
  );
}
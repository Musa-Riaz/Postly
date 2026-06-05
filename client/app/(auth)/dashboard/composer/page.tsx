import { Suspense } from "react";
import ComposerClient from "./ComposerClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComposerClient />
    </Suspense>
  );
}
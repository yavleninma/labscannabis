"use client";

import { useState } from "react";
import {
  getDraftId,
  useClient,
  useDocumentOperation,
  type DocumentActionComponent,
  type DocumentActionProps,
} from "sanity";

type SyncTranslationsResponse = {
  translations?: unknown[];
  error?: string;
};

async function pause(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export const StrainTranslatePublishAction: DocumentActionComponent = (
  props: DocumentActionProps,
) => {
  const client = useClient({ apiVersion: "2024-01-01" });
  const { publish } = useDocumentOperation(props.id, props.type);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sourceDocument = props.draft || props.published;

  return {
    label: isRunning ? "Publishing..." : "Publish",
    disabled: Boolean(publish.disabled) || isRunning,
    title: errorMessage || undefined,
    tone: errorMessage ? "critical" : undefined,
    onHandle: async () => {
      if (!sourceDocument) {
        props.onComplete();
        return;
      }

      setErrorMessage(null);
      setIsRunning(true);

      try {
        if (
          typeof sourceDocument.shortDescription === "string" &&
          sourceDocument.shortDescription.trim()
        ) {
          const response = await fetch("/api/strain/translations/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              strain: {
                name: sourceDocument.name,
                shortDescription: sourceDocument.shortDescription,
                fullDescription: sourceDocument.fullDescription || [],
                translations: sourceDocument.translations || [],
              },
            }),
          });

          const payload = (await response.json()) as SyncTranslationsResponse;
          if (!response.ok) {
            throw new Error(payload.error || "Failed to sync translations before publish");
          }

          if (Array.isArray(payload.translations)) {
            await client
              .patch(getDraftId(props.id))
              .set({ translations: payload.translations })
              .commit({ autoGenerateArrayKeys: true });
          }
        }

        publish.execute();
        await pause(1200);

        await fetch("/api/revalidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ documentType: "strain" }),
        });

        props.onComplete();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to publish strain");
      } finally {
        setIsRunning(false);
      }
    },
  };
};

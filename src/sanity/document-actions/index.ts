import type { DocumentActionComponent, DocumentActionsResolver } from "sanity";
import { StrainTranslatePublishAction } from "./strainTranslatePublishAction";

export const resolveDocumentActions: DocumentActionsResolver = (
  prev: DocumentActionComponent[],
  context,
) => {
  if (context.schemaType !== "strain") {
    return prev;
  }

  return prev.map((action) =>
    (action as DocumentActionComponent & { action?: string }).action === "publish"
      ? StrainTranslatePublishAction
      : action,
  );
};

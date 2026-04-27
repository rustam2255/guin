import type { ReactNode } from "react";
import "../../shared/i18n";

type Props = {
  children: ReactNode;
};

export function I18nProvider({ children }: Props) {
  return <>{children}</>;
}
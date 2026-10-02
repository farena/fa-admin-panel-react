import type { ReactNode } from "react";
import { Link, type To } from "react-router";
import { useClassParser } from "~/hooks/useClassParser";
import FormIcon from "./FormIcon";

type FormLinkProps = {
  to: To;
  label?: string;
  icon?: string;
  iconMaterial?: boolean;
  disabled?: boolean;
  flexField?: boolean;
  children?: ReactNode;
};

export default function FormLink({
  to,
  label,
  icon,
  iconMaterial = false,
  disabled = false,
  flexField = false,
  children,
}: FormLinkProps) {
  return (
    <div
      className={useClassParser({
        "form-container form-link": true,
        disabled,
        "flex-field": flexField,
      })}
    >
      {label && <label>{label}</label>}
      <div className="form-wrapper">
        <FormIcon icon={icon} iconMaterial={iconMaterial} as="div" />

        <Link className="link-dark link-underlined" to={to}>
          {children}
        </Link>
      </div>
    </div>
  );
}

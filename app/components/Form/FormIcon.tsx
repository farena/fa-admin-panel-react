type FormIconProps = {
  icon?: string;
  iconMaterial?: boolean;
  as?: "span" | "div";
  prefix?: string;
};

export default function FormIcon({
  icon,
  iconMaterial = false,
  as: Wrapper = "span",
  prefix,
}: FormIconProps) {
  if (!icon) return null;

  return (
    <Wrapper className="icon">
      {iconMaterial ? (
        <i className="material-symbols-outlined">{icon}</i>
      ) : (
        <i className={prefix ? `${prefix} ${icon}` : icon} />
      )}
    </Wrapper>
  );
}

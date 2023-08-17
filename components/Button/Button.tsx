import { MouseEventHandler, ReactNode, useMemo } from "react";
import Link from "next/link";
import cx from "classnames";

const Button = ({
  children,
  className,
  onClick,
  href,
}: {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<
    HTMLButtonElement | HTMLAnchorElement | HTMLDivElement
  >;
  href?: string;
}) => {
  const classes = useMemo(
    () =>
      cx(
        "block px-16 py-3 text-lg font-semibold rounded-xl bg-green text-white w-fit",
        className,
      ),
    [className],
  );

  if (href) {
    return (
      <Link className={classes} href={href} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const Element = onClick ? "button" : "div";

  return (
    <Element className={classes} onClick={onClick}>
      {children}
    </Element>
  );
};

export default Button;

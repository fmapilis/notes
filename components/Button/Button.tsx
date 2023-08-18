import { MouseEventHandler, ReactNode, useMemo } from "react";
import Link from "next/link";
import cx from "classnames";

import Spinner from "@/components/Spinner";

const Button = ({
  children,
  className,
  disabled,
  href,
  loading,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  loading?: boolean;
  onClick?: MouseEventHandler<
    HTMLButtonElement | HTMLAnchorElement | HTMLDivElement
  >;
}) => {
  const classes = useMemo(
    () =>
      cx(
        "flex items-center px-16 py-3 text-lg font-semibold rounded-xl bg-green text-white text-center w-fit",
        {
          "opacity-50 cursor-not-allowed": disabled,
        },
        className,
      ),
    [className, disabled],
  );

  if (href) {
    return (
      <Link
        className={classes}
        href={href}
        onClick={onClick}
        aria-disabled={disabled}
      >
        {children}
      </Link>
    );
  }

  const Element = onClick ? "button" : "div";

  return (
    <Element
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {children}
      {loading && <Spinner size={20} className="text-white ml-2" />}
    </Element>
  );
};

export default Button;

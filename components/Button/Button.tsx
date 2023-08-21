import cx from "classnames";
import Link from "next/link";
import { MouseEventHandler, ReactNode, useMemo } from "react";

import Spinner from "@/components/Spinner";

const Button = ({
  children,
  className,
  disabled,
  href,
  loading,
  onClick,
  size = "large",
  type = "button",
  variant = "primary",
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  loading?: boolean;
  onClick?: MouseEventHandler<
    HTMLButtonElement | HTMLAnchorElement | HTMLDivElement
  >;
  size?: "large" | "small";
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
}) => {
  const classes = useMemo(
    () =>
      cx(
        "flex items-center font-semibold rounded-xl text-center w-fit",
        {
          "px-12 py-2 text-lg border-4": size === "large",
          "px-6 py-1 text-base border-2": size === "small",
          "bg-green text-white border-green": variant === "primary",
          "bg-white text-green border-green": variant === "secondary",
          "opacity-50 cursor-not-allowed": disabled,
        },
        className
      ),
    [className, disabled, size, variant]
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

  const Element = onClick || type === "submit" ? "button" : "div";

  return (
    <Element
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {children}
      {loading && <Spinner size={20} className="text-white ml-2" />}
    </Element>
  );
};

export default Button;

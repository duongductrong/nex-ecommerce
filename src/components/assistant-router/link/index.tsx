"use client"

import NextLink, { LinkProps as NextLinkProps } from "next/link"
import { AnchorHTMLAttributes } from "react"
import { useAssistantNavigation } from "../hooks/use-assistant-navigation"

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps>,
    NextLinkProps {
  dynamic?: boolean
  scroll?: boolean
}

const Link = ({
  href,
  children,
  dynamic = false,
  scroll,
  ...props
}: LinkProps) => {
  const { navigate, dynamicNavigate } = useAssistantNavigation()

  return (
    <NextLink
      {...props}
      href={href}
      onClick={dynamic ? (dynamicNavigate as any) : (event) => navigate(event)}
    >
      {children}
    </NextLink>
  )
}

export default Link
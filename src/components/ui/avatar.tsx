"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    >
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIiBmaWxsPSJncmF5Ij48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNy4yIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjUgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTIyNCAyNTZBMTI4IDEyOCAwIDEgMCAyMjQgMGExMjggMTI4IDAgMSAwIDAgMjU2em0tNDUuNyA0OEM3OS44IDMwNCAwIDM4My44IDAgNDgyLjNDMCA0OTguNyAxMy4zIDUxMiAyOS43IDUxMmwzODguNiAwYzE2LjQgMCAyOS43LTEzLjMgMjkuNy0yOS43QzQ0OCAzODMuOCAzNjguMiAzMDQgMjY5LjcgMzA0bC05MS40IDB6Ii8+PC9zdmc+" alt="fallback" className="w-20 translate-y-4.5"/>
    </AvatarPrimitive.Fallback>
  )
}

export { Avatar, AvatarImage, AvatarFallback }

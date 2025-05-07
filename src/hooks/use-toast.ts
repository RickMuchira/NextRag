"use client"

// Replace previous toast implementation with sonner
import { toast as sonnerToast, type ToastT } from "sonner"

// Define types for the toast options
type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success" | "info" | "warning"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useToast() {
  const toast = ({ 
    title, 
    description, 
    variant = "default", 
    duration = 5000,
    action
  }: ToastProps) => {
    // Map the variant to sonner's appropriate function
    if (variant === "destructive") {
      return sonnerToast.error(title, {
        description,
        duration,
        action,
      })
    }
    
    if (variant === "success") {
      return sonnerToast.success(title, {
        description,
        duration,
        action,
      })
    }
    
    if (variant === "info") {
      return sonnerToast.info(title, {
        description,
        duration,
        action,
      })
    }
    
    if (variant === "warning") {
      return sonnerToast.warning(title, {
        description,
        duration,
        action,
      })
    }
    
    // Default case
    return sonnerToast(title, {
      description,
      duration,
      action,
    })
  }

  const dismiss = (toastId?: string) => {
    sonnerToast.dismiss(toastId)
  }

  return {
    toast,
    dismiss,
  }
}

// For direct usage without the hook
export const toast = ({ 
  title, 
  description, 
  variant = "default", 
  duration = 5000,
  action
}: ToastProps) => {
  if (variant === "destructive") {
    return sonnerToast.error(title, {
      description,
      duration,
      action,
    })
  }
  
  if (variant === "success") {
    return sonnerToast.success(title, {
      description,
      duration,
      action,
    })
  }
  
  if (variant === "info") {
    return sonnerToast.info(title, {
      description,
      duration,
      action,
    })
  }
  
  if (variant === "warning") {
    return sonnerToast.warning(title, {
      description,
      duration,
      action,
    })
  }
  
  // Default case
  return sonnerToast(title, {
    description,
    duration,
    action,
  })
}

// Make sure to also add the Toaster component in a separate file
// For example, in components/ui/sonner.tsx:
// 
// import { Toaster as SonnerToaster } from "sonner"
// 
// export function Toaster() {
//   return (
//     <SonnerToaster
//       className="toaster group"
//       toastOptions={{
//         classNames: {
//           toast: "group toast group-[.toaster]:border-border group-[.toaster]:bg-background group-[.toaster]:text-foreground",
//           description: "group-[.toast]:text-muted-foreground",
//           actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
//           cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
//         },
//       }}
//     />
//   )
// }
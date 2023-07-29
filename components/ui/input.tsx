import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string,
  message?: string | any

}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, message, ...props }, ref) => {

    return (
      <div className="col-span-12 sm:col-span-6">
        <label className="pl-1  text-base font-medium block">{label}</label>
        <input
          type={type}
          className={cn(
            "flex w-full p-[14px] mt-1 my-3 rounded-md border border-slate-200 bg-white px-3  text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-800",
            className
          )}
          ref={ref}
          {...props}
        />
        {message ? <span className="text-red-500">{message}</span> : null}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }

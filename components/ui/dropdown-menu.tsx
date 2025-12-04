"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenuContext = React.createContext<{
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <DropdownMenuContext.Provider value={{ open, setOpen }}>
            <div ref={ref} className="relative inline-block text-left">{children}</div>
        </DropdownMenuContext.Provider>
    );
};

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}

const DropdownMenuTrigger = ({ asChild, children, ...props }: DropdownMenuTriggerProps) => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

    const child = asChild ? React.Children.only(children) : null;

    if (child && React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
            onClick: (e: React.MouseEvent<HTMLElement>) => {
                const props = child.props as React.HTMLAttributes<HTMLElement>;
                props.onClick?.(e);
                context.setOpen(!context.open);
            },
            ...props
        });
    }

    return <button onClick={() => context.setOpen(!context.open)} {...props}>{children}</button>;
};

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: "center" | "end" | "start";
}

const DropdownMenuContent = ({ align = "center", className, children, ...props }: DropdownMenuContentProps) => {
    const context = React.useContext(DropdownMenuContext);

    if (!context?.open) return null;

    return (
        <div
            className={cn(
                "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
                align === "end" ? "right-0" : "left-0",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

const DropdownMenuItem = ({ className, children, onClick, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const context = React.useContext(DropdownMenuContext);
    return (
        <div
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
            onClick={(e) => {
                onClick?.(e);
                context?.setOpen(false);
            }}
            {...props}
        >
            {children}
        </div>
    );
};

const DropdownMenuLabel = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />
);

const DropdownMenuSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
);

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
}

import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_16px_40px_rgba(99,102,241,0.35)] hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(99,102,241,0.45)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_16px_36px_rgba(239,68,68,0.35)] hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(239,68,68,0.45)]",
        outline:
          "border border-white/30 bg-white/20 text-foreground backdrop-blur-sm hover:bg-white/40 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_16px_36px_rgba(14,165,233,0.35)] hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(14,165,233,0.45)]",
        ghost: "hover:bg-white/30 hover:text-foreground dark:hover:bg-white/10",
        link: "text-primary underline-offset-4 hover:underline",
        hero:
          "bg-gradient-to-r from-indigo-500 via-sky-500 to-pink-500 text-white shadow-[0_20px_50px_rgba(79,70,229,0.45)] hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(79,70,229,0.55)]",
        ai1: "bg-gradient-ai1 text-white hover:-translate-y-0.5 hover:shadow-glow",
        ai2: "bg-gradient-ai2 text-white hover:-translate-y-0.5 hover:shadow-glow-secondary",
        stop:
          "bg-gradient-to-r from-red-500 via-rose-500 to-rose-600 text-white hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(244,63,94,0.45)]",
        swap:
          "bg-muted text-muted-foreground hover:bg-white/60 hover:text-foreground dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11",
        fab: "h-16 w-16 rounded-full text-lg shadow-[0_20px_48px_rgba(99,102,241,0.45)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);


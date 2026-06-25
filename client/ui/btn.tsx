type Variant = "primary" | "ghost" | "danger"

interface Props {
  label: string
  onClick?: () => void
  variant?: Variant
  icon?: React.ReactNode
  full?: boolean
  type?: "button" | "submit"
}

const styles: Record<Variant, string> = {
  primary: "bg-[#0E72ED] hover:bg-[#0861CC] text-white",
  ghost: "bg-transparent border border-[#0E72ED] text-[#0E72ED] hover:bg-blue-50",
  danger: "bg-red-500 hover:bg-red-600 text-white",
}

export function Btn({ label, onClick, variant = "primary", icon, full, type = "button" }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm
        transition-colors duration-150 cursor-pointer
        ${styles[variant]} ${full ? "w-full justify-center" : ""}
      `}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {label}
    </button>
  )
}

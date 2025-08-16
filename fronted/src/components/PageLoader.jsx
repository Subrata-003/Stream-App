import { Loader2Icon } from "lucide-react"
import { useThemeStore } from "../store/useThemeStore"

const PageLoader = () => {
  const {theme}=useThemeStore();
  return (
    <div className="min-h-screen flex items-center justify-center" data-theme={theme}>
      <Loader2Icon className="animate-spin size-10 text-primary"></Loader2Icon>
    </div>
  )
}

export default PageLoader

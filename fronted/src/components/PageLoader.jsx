import { Loader2Icon } from "lucide-react"

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2Icon className="animate-spin size-10 text-primary"></Loader2Icon>
    </div>
  )
}

export default PageLoader

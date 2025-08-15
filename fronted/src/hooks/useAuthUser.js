import { useQuery } from "@tanstack/react-query"
import { getAuthUser } from "../lib/api.js"

const useAuthUser = () => {
  const authUser=useQuery({
      queryKey:["authUser"],
      queryFn: getAuthUser
})
 return {isLoading:authUser.isLoading,authUser:authUser?.data}
}

export default useAuthUser

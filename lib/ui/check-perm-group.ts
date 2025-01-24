import { Session } from "next-auth"

const checkPermGroup = (session: Session, permGroup: string) => {
  if (session) {
    if (session.user.permission_group === permGroup) return true
  }
  return false
}

export default checkPermGroup

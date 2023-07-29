import AssistantRouterProvider from "@/components/assistant-router/providers/assistant-router-provider"
import { getGrantsFromPrivileges } from "@/components/gates/lib/accesscontrol"
import { authOptions } from "@/lib/next-auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import AdminMainBar from "./_components/admin-main-bar"
import AdminNavigationBar from "./_components/admin-navigation-bar"
import AdminSidebar from "./_components/admin-sidebar"
import AdminProvider from "./_providers/admin-provider"

export const revalidate = false

export interface AdminLayoutProps extends CommonLayoutProps {}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const currentSession = await getServerSession(authOptions)
  const currentUserRole = await prisma.role.findFirst({
    where: { id: currentSession?.user.roleId },
  })

  return (
    <AdminProvider
      session={currentSession}
      role={currentUserRole?.id as string}
      grants={getGrantsFromPrivileges(
        currentUserRole?.privileges,
        currentUserRole?.id as string
      )}
    >
      <AssistantRouterProvider>
        <div className="flex">
          <AdminSidebar
            user={{
              role: currentUserRole?.id as string,
              privileges: currentUserRole?.privileges,
            }}
          />
          <AdminMainBar>
            <AdminNavigationBar />
            <div className="px-6 py-8">{children}</div>
          </AdminMainBar>
        </div>
      </AssistantRouterProvider>
    </AdminProvider>
  )
}

export default AdminLayout

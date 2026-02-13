import { AdminGuard } from "@/components/auth/admin-guard";
import { UserForm } from "@/components/forms/user-form";

export default function UserCreatePage() {
  return (
    <AdminGuard>
      <UserForm />
    </AdminGuard>
  );
}

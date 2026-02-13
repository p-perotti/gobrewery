import { AdminGuard } from "@/components/auth/admin-guard";
import { UserForm } from "@/components/forms/user-form";

export default function UserEditPage({ params }: { params: { id: string } }) {
  return (
    <AdminGuard allowGuestReadOnly>
      <UserForm userId={params.id} />
    </AdminGuard>
  );
}

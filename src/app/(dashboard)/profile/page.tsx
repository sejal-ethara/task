import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await getSession();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm text-muted-foreground">Email</span>
            <p className="font-medium">{session?.email}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Role</span>
            <p className="font-medium">{session?.role}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
    });
  }, []);

  async function handlePasswordUpdate() {
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully");
      setNewPassword("");
    }
    setLoading(false);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <div className="max-w-lg space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Email"
              value={email}
              disabled
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
            <Button onClick={handlePasswordUpdate} loading={loading}>
              Update Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

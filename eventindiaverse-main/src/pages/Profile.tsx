import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ full_name: "", email: "", phone: "", notifications_enabled: true });
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) setProfile({ full_name: data.full_name, email: data.email, phone: data.phone || "", notifications_enabled: data.notifications_enabled });
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      phone: profile.phone,
      notifications_enabled: profile.notifications_enabled,
    }).eq("user_id", user.id);
    setLoading(false);
    if (error) toast.error("Failed to update profile");
    else toast.success("Profile updated!");
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else { toast.success("Password updated!"); setNewPassword(""); }
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <div className="bg-card rounded-2xl p-6 border border-border space-y-5 mb-6">
          <h2 className="font-semibold text-lg">Personal Information</h2>
          <div>
            <Label>Full Name</Label>
            <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={profile.email} disabled className="mt-1.5 opacity-60" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-1.5" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Enable Notifications</Label>
            <Switch checked={profile.notifications_enabled} onCheckedChange={(v) => setProfile({ ...profile, notifications_enabled: v })} />
          </div>
          <Button onClick={handleSave} disabled={loading} className="rounded-xl">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border space-y-5">
          <h2 className="font-semibold text-lg">Change Password</h2>
          <div>
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" className="mt-1.5" />
          </div>
          <Button onClick={handleChangePassword} variant="outline" className="rounded-xl">
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

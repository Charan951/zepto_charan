import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account details.</p>
        </motion.div>

        <div className="glass-card-solid p-6 space-y-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Name</div>
            <div className="text-sm font-medium">{user?.name}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Email</div>
            <div className="text-sm font-medium break-all">{user?.email}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Role</div>
            <div className="text-sm font-medium capitalize">{user?.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


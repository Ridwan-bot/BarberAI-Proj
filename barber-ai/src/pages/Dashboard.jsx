import { useAuth } from "../state/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "profiles", user.uid));
      setProfile(snap.exists() ? snap.data() : null);
    };
    load();
  }, [user]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome, {user?.displayName || user?.email}</h1>
      <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(profile, null, 2)}</pre>
      <button
        onClick={() => signOut(auth)}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        Log out
      </button>
    </div>
  );
}

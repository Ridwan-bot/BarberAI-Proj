import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Min 6 characters"),
});

export default function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    const { name, email, password } = values;
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });

    // Create a starter profile doc
    await setDoc(doc(db, "profiles", cred.user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <h1 className="text-2xl font-bold">Create account</h1>
      <input className="border p-2 w-full" placeholder="Full name" {...register("name")} />
      {errors.name && <p className="text-red-600">{errors.name.message}</p>}

      <input className="border p-2 w-full" placeholder="Email" {...register("email")} />
      {errors.email && <p className="text-red-600">{errors.email.message}</p>}

      <input className="border p-2 w-full" type="password" placeholder="Password" {...register("password")} />
      {errors.password && <p className="text-red-600">{errors.password.message}</p>}

      <button disabled={isSubmitting} className="bg-black text-white px-4 py-2 rounded">
        {isSubmitting ? "Creating…" : "Sign up"}
      </button>
    </form>
  );
}

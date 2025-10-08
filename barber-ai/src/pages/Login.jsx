import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate, Link } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, password }) => {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <h1 className="text-2xl font-bold">Log in</h1>
      <input className="border p-2 w-full" placeholder="Email" {...register("email")} />
      {errors.email && <p className="text-red-600">{errors.email.message}</p>}

      <input className="border p-2 w-full" type="password" placeholder="Password" {...register("password")} />
      {errors.password && <p className="text-red-600">{errors.password.message}</p>}

      <button disabled={isSubmitting} className="bg-black text-white px-4 py-2 rounded">
        {isSubmitting ? "Signing in…" : "Log in"}
      </button>

      <p>New here? <Link to="/signup" className="underline">Create an account</Link></p>
    </form>
  );
}

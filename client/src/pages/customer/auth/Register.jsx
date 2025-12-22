// import Input from "../../components/Input";
import ThemeToggle from "../../../component/common/ThemeToggle";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[var(--card)] p-8 rounded w-[380px] space-y-4">
        <ThemeToggle />

        <h2 className="text-2xl font-semibold">Register</h2>

        {/* <Input placeholder="First Name" />
        <Input placeholder="Last Name" />
        <Input placeholder="Email" />
        <Input placeholder="Phone" />
        <Input type="password" placeholder="Password" /> */}

        <button className={`w-full p-3 rounded bg-[var(--accent)] text-black`}>
          Register
        </button>
      </div>
    </div>
  );
}

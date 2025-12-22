import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-md text-sm
        bg-[#B58863] text-white
        hover:opacity-90 transition"
    >
      {theme === "dark" ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}

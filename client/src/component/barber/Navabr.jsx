import ThemeToggle from "../common/ThemeToggle.jsx";


export default function Navbar() {
  return (
    <header className="h-14 flex items-center justify-between px-4 bg-surface border-b border-black/10 dark:border-white/10">
      <h1 className="font-bold text-text">NNN</h1>
      <ThemeToggle />
    </header>
  );
}

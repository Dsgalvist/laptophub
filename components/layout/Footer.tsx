// This component displays the footer across the application
// It provides branding and basic project information

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#0f172a] px-6 py-6 text-center text-sm text-gray-400">
      <p>© 2026 LaptopHub. All rights reserved.</p>
      <p className="mt-1">Built with Next.js, Firebase, and Tailwind CSS.</p>
    </footer>
  );
}
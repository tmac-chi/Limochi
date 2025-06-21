import { useState } from "react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  currentPage: string;
  icon: React.ReactNode;
}

export function Header({ currentPage, icon }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", key: "home" },
    { href: "/idea-generation", label: "Inspiration", key: "inspiration" },
    { href: "/challenge", label: "Challenge", key: "challenge" },
    { href: "/gallery", label: "Gallery", key: "gallery" }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - clickable */}
          <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Limochi</h1>
              <p className="text-sm text-gray-500 hidden sm:block">Unleash your imagination</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={`transition-colors ${
                  currentPage === item.key 
                    ? "text-primary font-medium" 
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className={`py-2 px-4 rounded-lg transition-colors ${
                    currentPage === item.key
                      ? "text-primary font-medium bg-primary/10"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
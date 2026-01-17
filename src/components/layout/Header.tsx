import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { List, X, Sun, Moon, Globe } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const currentLang = i18n.language;
  const isGerman = currentLang === "de";

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if a path is active
  const isActivePath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/de";
    }
    return location.pathname === path || location.pathname === `/de${path}`;
  };

  const toggleLanguage = () => {
    const newLang = isGerman ? "en" : "de";
    const currentPath = location.pathname;

    // Remove language prefix if exists
    const pathWithoutLang = currentPath.replace(/^\/(de|en)/, "") || "/";

    // Add new language prefix
    const newPath =
      newLang === "de" ? `/de${pathWithoutLang}` : pathWithoutLang;

    i18n.changeLanguage(newLang);
    window.history.pushState({}, "", newPath);
  };

  const getLocalizedPath = (path: string) => {
    return isGerman ? `/de${path}` : path;
  };

  const navigation = [
    { name: t("nav.home"), href: getLocalizedPath("/") },
    { name: t("nav.about"), href: getLocalizedPath("/about") },
    { name: t("nav.contact"), href: getLocalizedPath("/contact") },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-300",
        isScrolled
          ? "bg-neutral-bg/95 dark:bg-dark-bg/95 border-neutral-stroke dark:border-dark-stroke shadow-sm"
          : "bg-neutral-bg/80 dark:bg-dark-bg/80 border-neutral-stroke/50 dark:border-dark-stroke/50",
      )}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={getLocalizedPath("/")}
            className="flex items-center space-x-3 focus-ring rounded-full"
          >
            <img
              src="/logo.svg"
              alt="Automation Affairs Logo"
              className="w-8 h-8 object-contain filter dark:invert"
              onError={(e) => {
                // Fallback to PNG if SVG fails
                const target = e.target as HTMLImageElement;
                if (target.src.includes(".svg")) {
                  target.src = "/logo.png";
                } else {
                  // Final fallback to AA text
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = "flex";
                  }
                }
              }}
            />
            <div className="w-8 h-8 bg-primary rounded-lg items-center justify-center hidden">
              <span className="text-white font-heading text-sm font-bold">
                AA
              </span>
            </div>
            <span className="font-heading text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-neutral-ink dark:text-dark-text">
              <span className="sm:inline">AUTOMATION AFFAIRS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors focus-ring rounded-full px-4 py-2 uppercase tracking-wider",
                  isActivePath(item.href.replace(/^\/de/, ""))
                    ? "text-primary-cobalt font-semibold bg-primary-cobalt/10 dark:bg-primary-cobalt/20"
                    : "text-neutral-ink/70 hover:text-neutral-ink dark:text-dark-text/70 dark:hover:text-dark-text",
                )}
                style={{ fontFamily: "Lexend Tera, system-ui, sans-serif" }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center p-2 text-neutral-ink/70 hover:text-neutral-ink dark:text-dark-text/70 dark:hover:text-dark-text transition-colors focus-ring rounded-lg"
              aria-label={t("a11y.toggleLanguage")}
            >
              <Globe className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">
                {isGerman ? "EN" : "DE"}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-neutral-ink/70 hover:text-neutral-ink dark:text-dark-text/70 dark:hover:text-dark-text transition-colors focus-ring rounded-lg"
              aria-label={t("a11y.toggleTheme")}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* CTA Button */}
            <Button
              className="bg-primary dark:bg-[#f3ff5a] hover:bg-primary/90 dark:hover:bg-[#f3ff5a]/90 text-white dark:text-black"
              asChild
            >
              <Link
                to="/login"
                onClick={() => {
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }, 100);
                }}
              >
                {t("nav.getInTouch")}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-neutral-ink dark:text-dark-text focus-ring rounded-lg"
            aria-label={isMenuOpen ? t("a11y.closeMenu") : t("a11y.openMenu")}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <List className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-ink/10 dark:border-dark-text/10"
            >
              <div className="py-4 space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block px-4 py-2 text-base font-medium transition-colors focus-ring rounded-full uppercase tracking-wider",
                      isActivePath(item.href.replace(/^\/de/, ""))
                        ? "text-primary-cobalt font-semibold bg-primary-cobalt/10 dark:bg-primary-cobalt/20"
                        : "text-neutral-ink/70 hover:text-neutral-ink dark:text-dark-text/70 dark:hover:text-dark-text",
                    )}
                    style={{ fontFamily: "Lexend Tera, system-ui, sans-serif" }}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="flex items-center justify-between pt-4 border-t border-neutral-ink/10 dark:border-dark-text/10">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={toggleLanguage}
                      className="flex items-center p-2 text-neutral-ink/70 hover:text-neutral-ink dark:text-dark-text/70 dark:hover:text-dark-text transition-colors focus-ring rounded-lg"
                      aria-label={t("a11y.toggleLanguage")}
                    >
                      <Globe className="w-5 h-5" />
                      <span className="ml-1 text-sm font-medium">
                        {isGerman ? "EN" : "DE"}
                      </span>
                    </button>

                    <button
                      onClick={toggleTheme}
                      className="p-2 text-neutral-ink/70 hover:text-neutral-ink dark:text-dark-text/70 dark:hover:text-dark-text transition-colors focus-ring rounded-lg"
                      aria-label={t("a11y.toggleTheme")}
                    >
                      {theme === "light" ? (
                        <Moon className="w-5 h-5" />
                      ) : (
                        <Sun className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <Button
                    className="bg-primary dark:bg-[#f3ff5a] hover:bg-primary/90 dark:hover:bg-[#f3ff5a]/90 text-white dark:text-black"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link
                      to="/login"
                      onClick={() => {
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }, 100);
                      }}
                    >
                      {t("nav.getInTouch")}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

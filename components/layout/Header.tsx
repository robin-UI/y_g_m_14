"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, UserRound, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({name: ""});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (in a real app, you would use a proper auth system)
    const isLoggedIn = !!localStorage.getItem("currentUser");
    const currentUser = isLoggedIn
      ? JSON.parse(localStorage.getItem("currentUser") || "{}")
      : null;
      setIsLoggedIn(isLoggedIn);
    if (isLoggedIn) setCurrentUser(currentUser);

  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
    window.location.reload(); // Force refresh to update auth state
  };

  return (
    <header className="w-full py-4 px-4 md:px-8 bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-grey-200/50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-primary flex items-center"
            >
              <span className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-md p-1 mr-2">
                Y
              </span>
              YouGotaMentor
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-grey-700 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/mentors"
              className="text-grey-700 hover:text-primary transition-colors"
            >
              Find Mentors
            </Link>
            <Link
              href="/how-it-works"
              className="text-grey-700 hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="text-grey-700 hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-grey-100 transition-colors">
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage
                      src="/placeholder.svg"
                      alt={currentUser?.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {currentUser?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-grey-800 font-medium">
                    {currentUser?.name || "User"}
                  </span>
                  <ChevronDown size={16} className="text-grey-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <UserRound className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary-light/10"
                  onClick={() => router.push("/login")}
                >
                  Log In
                </Button>
                <Button
                  className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 text-white"
                  onClick={() => router.push("/login")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-grey-700 hover:text-primary py-2 px-4 rounded-md hover:bg-grey-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/mentors"
                className="text-grey-700 hover:text-primary py-2 px-4 rounded-md hover:bg-grey-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Mentors
              </Link>
              <Link
                href="/how-it-works"
                className="text-grey-700 hover:text-primary py-2 px-4 rounded-md hover:bg-grey-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                className="text-grey-700 hover:text-primary py-2 px-4 rounded-md hover:bg-grey-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="pt-2 flex flex-col space-y-2">
                {isLoggedIn ? (
                  <div className="border-t border-grey-200 pt-3">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <Avatar className="h-8 w-8 border">
                        <AvatarImage
                          src="/placeholder.svg"
                          alt={currentUser?.name || "User"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {currentUser?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {currentUser?.name || "User"}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-2 text-grey-700"
                        onClick={() => {
                          router.push("/profile");
                          setMobileMenuOpen(false);
                        }}
                      >
                        <UserRound className="mr-2 h-4 w-4" />
                        My Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-2 text-grey-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="border-primary text-primary w-full"
                      onClick={() => {
                        router.push("/login");
                        setMobileMenuOpen(false);
                      }}
                    >
                      Log In
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-primary to-primary-dark w-full text-white"
                      onClick={() => {
                        router.push("/login");
                        setMobileMenuOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Blocks,
  ChevronsUpDown,
  FileClock,
  GraduationCap,
  Layout,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  MessagesSquare,
  Plus,
  Settings,
  UserCircle,
  UserCog,
  UserSearch,
  Home,
  Briefcase,
  Calendar,
  Users,
  FileText,
  BarChart3,
  HelpCircle,
  Bot,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface SideMenuProps {
  defaultCollapsed?: boolean;
  className?: string;
}

const sidebarVariants = {
  open: {
    width: "16rem",
  },
  closed: {
    width: "4rem",
  },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
};

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
  badgeVariant?: "default" | "outline" | "secondary" | "destructive";
}

export const SideMenu: React.FC<SideMenuProps> = ({ 
  defaultCollapsed = true,
  className
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/" },
    { title: "Builder", icon: Bot, href: "/builder", badge: "Active" },
    { title: "Agents", icon: Users, href: "/agents" },
    { title: "Projects", icon: Briefcase, href: "/projects" },
    { title: "Messages", icon: MessagesSquare, href: "/messages" },
    { title: "Documents", icon: FileText, href: "/documents" },
    { title: "Settings", icon: Settings, href: "/settings" },
    { title: "Help", icon: HelpCircle, href: "/help" },
  ];

  return (
    <motion.div
      className={cn(
        "sidebar fixed left-0 z-40 h-full shrink-0 border-r bg-background",
        className
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className="relative z-40 flex h-full shrink-0 flex-col transition-all"
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col">
            {/* Header with logo/branding */}
            <div className="flex h-16 w-full shrink-0 items-center border-b p-4">
              <div className="flex w-full items-center">
                <Avatar className="h-8 w-8 rounded-md bg-primary">
                  <AvatarFallback className="text-primary-foreground">
                    IN
                  </AvatarFallback>
                </Avatar>
                <motion.li
                  variants={variants}
                  className="flex w-fit items-center"
                >
                  {!isCollapsed && (
                    <p className="ml-3 text-lg font-semibold">
                      Inflect
                    </p>
                  )}
                </motion.li>
              </div>
            </div>

            {/* Main menu items */}
            <div className="flex h-full w-full flex-col">
              <div className="flex grow flex-col">
                <ScrollArea className="h-full p-3">
                  <div className="flex w-full flex-col gap-1">
                    {menuItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                          "flex h-10 w-full flex-row items-center rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground",
                          pathname === item.href && "bg-accent text-accent-foreground font-medium"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <motion.li variants={variants}>
                          {!isCollapsed && (
                            <div className="ml-3 flex items-center justify-between w-full">
                              <span className="text-sm">{item.title}</span>
                              {item.badge && (
                                <Badge
                                  className="ml-auto"
                                  variant={item.badgeVariant || "default"}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          )}
                        </motion.li>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* User profile section */}
              <div className="mt-auto border-t p-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full items-center justify-start gap-3 px-3 py-2 h-auto"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>US</AvatarFallback>
                      </Avatar>
                      <motion.li
                        variants={variants}
                        className="flex w-full items-center justify-between"
                      >
                        {!isCollapsed && (
                          <>
                            <div className="flex flex-col items-start text-left">
                              <span className="text-sm font-medium">User</span>
                              <span className="text-xs text-muted-foreground">
                                user@example.com
                              </span>
                            </div>
                            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                          </>
                        )}
                      </motion.li>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>US</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">User</span>
                        <span className="text-xs text-muted-foreground">
                          user@example.com
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Settings className="h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}; 
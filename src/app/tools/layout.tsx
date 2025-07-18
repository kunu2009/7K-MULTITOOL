'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { toolsConfig } from '@/config/tools';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github } from 'lucide-react';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-7 text-primary" />
            <h1 className="text-lg font-semibold">7K MultiTool</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {toolsConfig.map((category) => (
              <SidebarGroup key={category.id}>
                <SidebarGroupLabel>{category.name}</SidebarGroupLabel>
                {category.tools.map((tool) => (
                  <SidebarMenuItem key={tool.slug}>
                    <Link href={tool.implemented ? `/tools/${tool.slug}` : '#'} legacyBehavior passHref>
                      <SidebarMenuButton
                        isActive={pathname === `/tools/${tool.slug}`}
                        disabled={!tool.implemented}
                        tooltip={tool.name}
                      >
                        <tool.icon className="size-4" />
                        <span>{tool.name}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarGroup>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2" />
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Github className="size-4" />
            <span>GitHub</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between border-b p-2">
            <SidebarTrigger />
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

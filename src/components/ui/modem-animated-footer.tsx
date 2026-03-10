import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  brandName?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  className?: string;
}

export const Footer = ({
  brandName = "YourBrand",
  socialLinks = [],
  navLinks = [],
  creatorName,
  creatorUrl,
  className,
}: FooterProps) => {
  return (
    <section className={cn("relative w-full mt-0 overflow-hidden", className)}>
      <footer className="border-t bg-background mt-20 relative">
        <div className="max-w-7xl flex flex-col justify-between mx-auto min-h-[20rem] sm:min-h-[22rem] md:min-h-[25rem] relative p-4 py-10">
          <div className="flex flex-col mb-12 sm:mb-20 md:mb-0 w-full">
            <div className="w-full flex flex-col items-center">
              {socialLinks.length > 0 && (
                <div className="flex mb-8 mt-3 gap-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="w-6 h-6 hover:scale-110 duration-300">
                        {link.icon}
                      </div>
                      <span className="sr-only">{link.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-20 md:mt-24 flex flex-col gap-4 items-center justify-center px-4 md:px-0">
            <div className="flex flex-col gap-2 md:gap-1 items-center justify-center w-full">
              {creatorName && creatorUrl && (
                <nav className="flex gap-4">
                  <a
                    href={creatorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-muted-foreground hover:text-foreground transition-colors duration-300 hover:font-medium"
                  >
                    © 2026 UDI DIGI SWASTHYATECH PVT. LTD.
                  </a>
                </nav>
              )}
            </div>

            {navLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-muted-foreground max-w-full mt-2">
                {navLinks.map((link, index) => (
                  link.external ? (
                    <a
                      key={index}
                      className="hover:text-foreground duration-300 hover:font-semibold"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={index}
                      className="hover:text-foreground duration-300 hover:font-semibold"
                      to={link.href}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Large background text */}
        <div 
          className="bg-gradient-to-b from-foreground/20 via-foreground/10 to-transparent bg-clip-text text-transparent leading-none absolute left-1/2 -translate-x-1/2 bottom-44 md:bottom-40 font-extrabold tracking-tighter pointer-events-none select-none text-center px-4"
          style={{
            fontSize: 'clamp(3rem, 12vw, 10rem)',
            maxWidth: '95vw'
          }}
        >
          {brandName.toUpperCase()}
        </div>

        {/* Bottom logo */}
        {/* <div className="absolute hover:border-foreground/60 duration-400 drop-shadow-[0_0px_30px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_0px_30px_rgba(255,255,255,0.2)] bottom-32 md:bottom-30 rounded-3xl backdrop-blur-md bg-white/10 dark:bg-black/10 left-1/2 border border-white/20 dark:border-white/10 flex items-center justify-center p-3 -translate-x-1/2 z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <div className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 flex items-center justify-center">
            {brandIcon || (
              <NotepadTextDashed className="w-8 sm:w-10 md:w-14 h-8 sm:h-10 md:h-14 text-background drop-shadow-lg" />
            )}
          </div>
        </div> */}

        {/* Bottom line */}
        <div className="absolute bottom-40 sm:bottom-42 backdrop-blur-sm h-1 bg-gradient-to-r from-transparent via-border to-transparent w-full left-1/2 -translate-x-1/2"></div>

        {/* Bottom shadow */}
        <div className="bg-gradient-to-t from-background via-background/80 blur-[1em] to-background/40 absolute bottom-28 w-full h-24"></div>
      </footer>
    </section>
  );
};

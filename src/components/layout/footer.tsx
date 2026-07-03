import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon as XSocialIcon,
} from "@/components/icons/social-icons";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

const socialLinks = [
  { href: process.env.NEXT_PUBLIC_INSTAGRAM_URL, label: "Instagram", Icon: InstagramIcon },
  { href: process.env.NEXT_PUBLIC_FACEBOOK_URL, label: "Facebook", Icon: FacebookIcon },
  { href: process.env.NEXT_PUBLIC_TIKTOK_URL, label: "TikTok", Icon: TikTokIcon },
  { href: process.env.NEXT_PUBLIC_TWITTER_URL, label: "X", Icon: XSocialIcon },
].filter((s): s is { href: string; label: string; Icon: typeof InstagramIcon } => Boolean(s.href));

export function Footer() {
  return (
    <footer className="border-t border-border bg-ink-900 text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Image
            src="/images/brand/logo-light.png"
            alt="Blitz Jerseys"
            width={405}
            height={200}
            className="h-9 w-auto"
          />
          <p className="mt-3 max-w-sm text-sm text-white/70">
            Performance football shirts inspired by the biggest clubs in the
            Premier League, Serie A, and LaLiga. Built for match day, worn on
            the street.
          </p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-brand-300 hover:text-brand-300"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link href="/promotions" className="text-accent-400 hover:text-accent-300">Promotions</Link></li>
            <li><Link href="/shop/premier-league" className="hover:text-brand-300">Premier League</Link></li>
            <li><Link href="/shop/serie-a" className="hover:text-brand-300">Serie A</Link></li>
            <li><Link href="/shop/la-liga" className="hover:text-brand-300">LaLiga</Link></li>
            <li><Link href="/shop" className="hover:text-brand-300">All Kits</Link></li>
            <li><Link href="/custom-order" className="hover:text-brand-300">Custom Order</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Get in Touch</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-brand-300"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </li>
            <li><Link href="/contact" className="hover:text-brand-300">Contact Page</Link></li>
            <li><Link href="/about" className="hover:text-brand-300">About Blitz</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Blitz Jerseys. Fan apparel inspired by the game we love.
      </div>
    </footer>
  );
}

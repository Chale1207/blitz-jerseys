import { MessageCircle } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon as XSocialIcon,
} from "@/components/icons/social-icons";

export const metadata = { title: "Contact | Blitz Jerseys" };

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

const socialLinks = [
  { href: process.env.NEXT_PUBLIC_INSTAGRAM_URL, label: "Instagram", Icon: InstagramIcon },
  { href: process.env.NEXT_PUBLIC_FACEBOOK_URL, label: "Facebook", Icon: FacebookIcon },
  { href: process.env.NEXT_PUBLIC_TIKTOK_URL, label: "TikTok", Icon: TikTokIcon },
  { href: process.env.NEXT_PUBLIC_TWITTER_URL, label: "X", Icon: XSocialIcon },
].filter((s): s is { href: string; label: string; Icon: typeof InstagramIcon } => Boolean(s.href));

export default function ContactPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          Talk to Us
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase text-ink-900 md:text-5xl">
          Get in Touch
        </h1>
        <p className="mt-4 text-sm text-muted">
          Orders are confirmed over WhatsApp &mdash; sizes, delivery cost, and
          timing, sorted directly with our team.
        </p>

        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:scale-105 active:scale-95"
        >
          <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
        </a>

        <div className="mt-10 flex justify-center gap-3">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink-900 transition-colors hover:border-brand-500 hover:text-brand-600"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

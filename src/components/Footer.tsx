import { Link } from "react-router-dom";
import { Leaf, Mail, MapPin, Linkedin, Github } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const navItems = [
    { label: t("footer.home"), to: "/" },
    { label: t("nav.climascan"), to: "/climascan" },
    { label: t("nav.ecodev"), to: "/ecodev" },
    { label: t("nav.offset"), to: "/offset" },
  ];

  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container">
        <div className="mb-8 flex justify-center">
          <div className="h-px w-48 bg-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.navigation")}</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4 text-primary" />climacode@gmail.com</li>
              <li className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />Almaty, Kazakhstan</li>
              <li className="flex items-center gap-2 text-muted-foreground"><Linkedin className="h-4 w-4 text-primary" />ClimaCode.kz</li>
              <li className="flex items-center gap-2 text-muted-foreground"><Github className="h-4 w-4 text-primary" />github.com/climacode</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {["Instagram", "Facebook", "Telegram"].map((social) => (
            <a key={social} href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
              {social[0]}
            </a>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Leaf className="h-4 w-4 text-primary" />
          <p>© {new Date().getFullYear()} ClimaCode.kz. {t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

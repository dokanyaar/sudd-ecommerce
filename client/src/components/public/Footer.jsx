import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-gray-200 bg-white sm:mt-24">
      {/* Main Footer */}
      <div className="grid gap-12 py-14 sm:grid-cols-2 sm:py-16 lg:grid-cols-[2fr_1fr_1fr_1.2fr] lg:gap-12">
        {/* Brand */}
        <div className="max-w-sm">
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight text-gray-950"
          >
            Sudd Shop
          </Link>

          <p className="mt-5 text-sm leading-7 text-gray-500">
            Clothing, footwear and everyday accessories selected for comfort,
            quality and effortless style.
          </p>
        </div>

        {/* Shop */}
        <FooterColumn title="Shop">
          <FooterLink to="/collection">All products</FooterLink>
          <FooterLink to="/collection">New arrivals</FooterLink>
          <FooterLink to="/collection">Best sellers</FooterLink>
          <FooterLink to="/wishlist">Wishlist</FooterLink>
        </FooterColumn>

        {/* Help */}
        <FooterColumn title="Help">
          <FooterLink to="/contact">Contact us</FooterLink>
          <FooterLink to="/delivery">Delivery</FooterLink>
          <FooterLink to="/returns">Returns</FooterLink>
          <FooterLink to="/orders">Track your order</FooterLink>
        </FooterColumn>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-medium text-gray-950">Get in touch</h3>

          <div className="mt-5 space-y-4">
            <div className="flex items-start gap-3 text-sm text-gray-500">
              <Phone size={16} strokeWidth={1.6} className="mt-0.5 shrink-0" />

              <span>+254 700 000 000</span>
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-500">
              <Mail size={16} strokeWidth={1.6} className="mt-0.5 shrink-0" />

              <span>hello@suddshop.com</span>
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-500">
              <MapPin size={16} strokeWidth={1.6} className="mt-0.5 shrink-0" />

              <span>Kenya</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="flex flex-col gap-4 border-t border-gray-200 py-6 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© {currentYear} Sudd Shop. All rights reserved.</p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <FooterLinkSmall to="/privacy">Privacy policy</FooterLinkSmall>

          <FooterLinkSmall to="/terms">Terms</FooterLinkSmall>

          <FooterLinkSmall to="/cookies">Cookies</FooterLinkSmall>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, children }) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-950">{title}</h3>

      <div className="mt-5 flex flex-col items-start gap-3">{children}</div>
    </div>
  );
};

const FooterLink = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="text-sm text-gray-500 transition-colors duration-200 hover:text-black"
    >
      {children}
    </Link>
  );
};

const FooterLinkSmall = ({ to, children }) => {
  return (
    <Link to={to} className="transition-colors duration-200 hover:text-black">
      {children}
    </Link>
  );
};

export default Footer;

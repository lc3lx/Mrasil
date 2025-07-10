import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

export function Footer() {
  return (
    <footer className="py-16" style={{ background: "#D4DBEA" }}>
      <div className="flex flex-col items-center justify-center">
        <ul className="footer-icons mb-8">
          <li style={{ "--clr": "#1877f2" } as React.CSSProperties}>
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
          </li>
          <li style={{ "--clr": "#1da1f2" } as React.CSSProperties}>
            <a href="#" aria-label="Twitter/X">
              <FaTwitter />
            </a>
          </li>
          <li style={{ "--clr": "#c32aa3" } as React.CSSProperties}>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
          </li>
          <li style={{ "--clr": "#ff0000" } as React.CSSProperties}>
            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>
          </li>
          <li style={{ "--clr": "#25d366" } as React.CSSProperties}>
            <a href="#" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </li>
        </ul>
        <div
          className="text-center text-sm text-blue-900"
          style={{ marginTop: "18rem" }}
        >
          <p>© 2025 Marasil. All rights reserved.</p>
        </div>
        <style jsx>{`
          .footer-icons {
            position: relative;
            display: flex;
            gap: 50px;
            padding: 0;
            margin: 0;
          }
          .footer-icons li {
            list-style: none;
            position: relative;
            width: 80px;
            height: 80px;
          }
          .footer-icons li a {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80px;
            height: 80px;
            background: transparent;
            border-radius: 50%;
            text-decoration: none;
            font-size: 48px;
            color: #444;
            transition: 0.5s;
            box-shadow: none;
            border: none;
            -webkit-box-reflect: below 24px
              linear-gradient(transparent, rgba(0, 0, 0, 0.18));
            box-reflect: below 24px
              linear-gradient(transparent, rgba(0, 0, 0, 0.18));
          }
          .footer-icons li a:hover {
            transform: translateY(-20px) scale(1.12);
            background: var(--clr);
            color: #fff;
            box-shadow: none;
          }
        `}</style>
      </div>
    </footer>
  );
}

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
      <div className="flex flex-col items-center justify-center ">
        <ul className="footer-icons mb-8">
          {/* <li style={{ "--clr": "#1877f2" }   as React.CSSProperties} className=" w-[34px] h-[34px] sm:w-[80px] sm:h-[80px]">
            <a href="#" aria-label="Facebook" className=" w-[34px] h-[34px] sm:w-[80px] sm:h-[80px]">
              <FaFacebookF />
            </a>
          </li> */}
          <li style={{ "--clr": "#1da1f2" } as React.CSSProperties} className=" w-[34px] h-[34px] sm:w-[80px] sm:h-[80px]">
            <a href="#" aria-label="Twitter/X" className="w-[34px] h-[34px] sm:w-[80px] sm:h-[80px]">
              <FaTwitter />
            </a>
          </li>
          <li style={{ "--clr": "#c32aa3" } as React.CSSProperties} className=" w-[34px] h-[34px] sm:w-[80px] sm:h-[80px]">
            <a href="#" aria-label="Instagram" className=" w-[34px] h-[34px] sm:w-[80px] sm:h-[80px]">
              <FaInstagram />
            </a>
          </li>
          <li style={{ "--clr": "#ff0000" } as React.CSSProperties} className="w-[34px] h-[34px] sm:w-[80px] sm:h-[80px]">
            <a href="#" aria-label="YouTube" className=" w-[34px] h-[34px] sm:w-[80px] sm:h-[80px]">
              <FaYoutube />
            </a>
          </li>
          <li style={{ "--clr": "#25d366" } as React.CSSProperties} className=" w-[34px] h-[34px] sm:w-[80px] sm:h-[80px]">
            <a href="#" aria-label="WhatsApp" className="w-[34px] h-[34px] sm:w-[80px] sm:h-[80px]">
              <FaWhatsapp />
            </a>
          </li>
        </ul>
        <div
          className="text-center text-sm text-blue-900 grid-"
          style={{ marginTop: "18rem" }}
        >
          <p>© 2025 Marasil. All rights reserved.</p>
        </div>
        <style jsx>{`
          .footer-icons {
            position: relative;
            display: flex;
            flex-wrap:wrap;
            gap: 50px;
            padding: 0;
            margin: 0;
          }
          .footer-icons li {
            list-style: none;
            position: relative;
          }
          .footer-icons li a {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;

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

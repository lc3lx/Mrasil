import type React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function SallaIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="24"
      height="24"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  );
}

export function ShopifyIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="24"
      height="24"
      {...props}
    >
      <path d="M15.337 3.346l-.968.285c-.008-.103-.084-.285-.142-.388-.208-.36-.526-.526-.9-.526-.026 0-.052 0-.077.002-.013-.017-.027-.035-.042-.052-.202-.214-.467-.322-.788-.322-.608 0-1.214.36-1.714 1.022-.354.463-.623 1.042-.7 1.496l-1.473.44c-.436.138-.45.15-.506.56-.044.308-1.25 9.545-1.25 9.545l9.362 1.764 5.069-1.248c0 0-1.757-11.892-1.757-11.9-.044-.308-.176-.42-.614-.677zm-2.893 1.41c-.323.097-.686.208-1.068.323.103-.388.296-.742.526-1.003.088-.097.232-.214.388-.296-.018.308.052.668.154.977zm-.44-1.36c.103 0 .206.026.296.07-.154.07-.296.18-.44.322-.36.36-.634.9-.77 1.432-.36.103-.722.22-1.094.334.232-.8.788-2.158 2.008-2.158zm-1.178.977c.142 0 .258.026.36.07-.018.018-.044.035-.062.053-.323.36-.583.9-.72 1.45-.36.112-.73.22-1.094.334.206-.8.73-1.907 1.516-1.907z" />
    </svg>
  );
}

export function ZidIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="24"
      height="24"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

export function WooCommerceIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="24"
      height="24"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

export function MagentoIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="24"
      height="24"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h2v7h2v-7h2v7h2v-7h2v7h2V9c0-1.1-.9-2-2-2h-8c-1.1 0-2 .9-2 2v8h2v-7z" />
    </svg>
  );
}

export function AmazonIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="24"
      height="24"
      {...props}
    >
      <path d="M15.93 11.9c-.1-.8-.34-1.47-.71-2-.37-.53-.88-.97-1.53-1.31-.65-.34-1.39-.52-2.21-.52-.81 0-1.54.18-2.18.54-.65.36-1.15.82-1.53 1.4-.37.57-.63 1.23-.77 1.97-.14.74-.17 1.5-.09 2.29.08.79.28 1.52.6 2.21.31.69.77 1.23 1.37 1.64.6.41 1.36.62 2.25.62.89 0 1.66-.21 2.29-.62.63-.41 1.14-.96 1.53-1.64.39-.68.65-1.46.77-2.35.12-.88.12-1.74.01-2.58h-.8v.35zm-1.24 1.7c-.07.57-.2 1.1-.4 1.59-.2.49-.49.89-.88 1.19-.38.3-.89.45-1.52.45-.63 0-1.13-.15-1.49-.45-.36-.3-.64-.7-.83-1.19-.19-.49-.31-1.02-.35-1.59-.04-.57-.03-1.1.03-1.59.06-.49.19-.93.39-1.31.2-.38.48-.68.85-.9.37-.22.83-.33 1.4-.33.57 0 1.04.11 1.4.33.36.22.65.52.86.9.21.38.36.82.43 1.31.07.49.08 1.02.03 1.59h.08z" />
    </svg>
  );
}

export function CustomIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="24"
      height="24"
      {...props}
    >
      <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 4c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2zm2-6c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm4 6c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2z" />
    </svg>
  );
}

// Iconos específicos para plataformas de comercio electrónico
export function StoreIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="24"
      height="24"
      {...props}
    >
      <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
    </svg>
  );
}

export function RiyalIcon({ className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
      width="20"
      height="20"
      {...props}
    >
      <text x="3" y="18" fontSize="18" fontFamily="Arial">
        ﷼
      </text>
    </svg>
  );
}

import { Camera } from "lucide-react";
import React, { useState, useEffect } from "react";

type Props = {
  initialImage?: string;
  onFileSelect?: (file: File) => void;
};

export default function ProfileUpLoad({ initialImage, onFileSelect }: Props) {
  const [image, setImage] = useState<string>(
    initialImage || "/homePageImages/user.jpg"
  );

  // تحديث الصورة عند تغيير initialImage
  useEffect(() => {
    if (initialImage) {
      setImage(initialImage);
    }
  }, [initialImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      onFileSelect?.(file);
    }
  };

  return (
    <div className="   mb-4 flex items-center justify-center flex-col">
      <div className="v7-neu-avatar min-w-32  min-h-32 overflow-hidden rounded-full">
        <img
          src={image}
          alt="صورة الملف الشخصي"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative mt-6 w-10 h-10 rounded-full v7-neu-button-sm flex items-center justify-center cursor-pointer">
        <Camera className="h-6 w-6 text-[#3498db]" />
        <input
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
              // 5MB
              alert("الملف كبير جدًا، الرجاء اختيار صورة أصغر من 5MB");
              return;
            }
            onFileSelect?.(file);
            const url = URL.createObjectURL(file);
            setImage(url);
          }}
        />
      </div>
    </div>
  );
}

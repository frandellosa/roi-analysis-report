
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";

const Navigation = () => {
  const [logoSrc, setLogoSrc] = useState("/lovable-uploads/4d7ebcea-986b-41ce-9dca-3cb9194c2aa6.png");
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoSrc(event.target?.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <nav className="border-b border-gray-200 py-4 bg-white">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <div className="flex-1"></div>
        <div className="flex items-center">
          <img 
            src={logoSrc} 
            alt="Brand Logo" 
            className="h-16" 
          />
        </div>
        
        {/* Logo Upload Button */}
        <div className="flex-1 flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 opacity-10 hover:opacity-100 transition-opacity">
                <ImagePlus className="h-4 w-4" />
                Change Logo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Your Logo</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-center gap-4">
                  <img 
                    src={logoSrc} 
                    alt="Current Logo" 
                    className="h-24 mb-2 border p-2 rounded" 
                  />
                  <Input 
                    id="logo-upload" 
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoChange}
                    disabled={isUploading}
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Recommended size: 512x128px. SVG, PNG or JPG formats preferred.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

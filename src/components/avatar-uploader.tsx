"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateUserAvatarAction } from "@/actions/user";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";

export function AvatarUploader() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please select a file smaller than 2MB.",
        });
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file || !user) {
        toast({ variant: "destructive", title: "No file selected" });
        return;
    };
    setIsUploading(true);
    try {
        const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
        const uploadTask = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(uploadTask.ref);

        await updateUserAvatarAction(downloadURL);
        
        toast({
            title: "Avatar updated!",
            description: "Your new avatar has been saved.",
        });
        
        // Refresh the page to show the new avatar in the sidebar
        window.location.reload();

    } catch (error) {
         toast({
            variant: "destructive",
            title: "Upload failed",
            description: error instanceof Error ? error.message : "Could not upload your avatar.",
        });
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center bg-muted overflow-hidden">
            {preview ? (
                <Image src={preview} alt="Avatar preview" layout="fill" objectFit="cover" />
            ) : (
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
            )}
        </div>
        <div className="flex-1 w-full sm:w-auto">
            <Input id="avatar" type="file" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} className="mb-2"/>
            <p className="text-xs text-muted-foreground mb-2">PNG, JPG, GIF up to 2MB.</p>
            <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full sm:w-auto">
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                Upload & Save
            </Button>
        </div>
    </div>
  );
}

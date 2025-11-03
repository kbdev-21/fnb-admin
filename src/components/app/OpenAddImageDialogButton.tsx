import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImagePlus } from "lucide-react"
import { uploadImage } from "@/service/fnb-api"
import {useAuth} from "@/contexts/AuthContext.tsx";

export function OpenAddImageDialogButton(
  {
    onUploaded
  }: {
    onUploaded?: (url: string) => void
  }
) {
  const auth = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: () => {
      if(!file) throw new Error("No file selected")
      return uploadImage(auth.token ?? "", file)
    },
    onSuccess: (res) => {
      onUploaded?.(res.publicUrl);
      setOpen(false);
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : "Upload failed")
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-20 w-20 cursor-pointer border-muted-foreground border-dashed">
          <ImagePlus />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Image upload</DialogTitle>
          <DialogDescription>Upload and set the image</DialogDescription>
        </DialogHeader>

        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <DialogFooter className="flex justify-center">
          <Button onClick={() => mutation.mutate()} disabled={!file || mutation.isPending}>
            {mutation.isPending ? "Uploading..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

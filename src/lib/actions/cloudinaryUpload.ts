export async function uploadToCloudinary(file: File, uploadPreset: string): Promise<string> {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!CLOUD_NAME) {
    throw new Error("Cloudinary cloud name is not set in environment variables");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload file to Cloudinary");
  }

  const data = await res.json();
  return data.secure_url as string;
}

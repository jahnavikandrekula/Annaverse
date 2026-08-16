import { Cloudinary } from "@cloudinary/url-gen";

// Initialize Cloudinary instance with the cloud name
export const cld = new Cloudinary({
  cloud: {
    cloudName: "ceiz9qad",
  },
});

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  asset_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

/**
 * Uploads a file directly to Cloudinary using an unsigned upload preset.
 * This is safe to run on the client side since it does not require the API Secret.
 * 
 * @param file The file object to upload (e.g. from a file input)
 * @param uploadPreset The unsigned upload preset name configured in the Cloudinary Dashboard
 * @param onProgress Optional callback to monitor upload progress (0 to 100)
 */
export async function uploadToCloudinary(
  file: File,
  uploadPreset: string,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResponse> {
  const cloudName = "ceiz9qad";
  // Using /auto/upload lets Cloudinary automatically detect image or video type
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    // Track upload progress
    if (onProgress && xhr.upload) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded * 100) / event.total);
          onProgress(percentage);
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText) as CloudinaryUploadResponse;
          resolve(response);
        } catch (error) {
          reject(new Error("Failed to parse Cloudinary response"));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.error?.message || "Cloudinary upload failed"));
        } catch {
          reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during Cloudinary upload"));
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    xhr.send(formData);
  });
}

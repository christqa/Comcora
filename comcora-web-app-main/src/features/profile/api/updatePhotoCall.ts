export const updatePhotoCall = async (
  body: FormData,
  encryptedAccessPin: string
) => {
  const response = await fetch("/api/upload/profile-image", {
    method: "POST",
    body,
    headers: {
      "X-Encrypted-PIN": encryptedAccessPin,
    },
  });

  if (!response.ok) {
    throw new Error("Error uploading profile image");
  }

  const result: { success: boolean } = await response.json();
  if (!result) throw new Error("Error uploading profile image");
  return result;
};

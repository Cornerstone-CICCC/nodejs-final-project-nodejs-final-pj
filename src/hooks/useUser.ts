import { useState } from "react";
import { User } from "@/types/user";

type useUpdateUserType = {
  onSubmit: (data: User) => Promise<void>,
  loading: boolean,
  showError: boolean,
  errorMessage: string,
}

export function useUpdateUser(): useUpdateUserType {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showError, setShowError] = useState(false)

  const onSubmit = async (data: User) => {
    console.log("Form submitted:", data);

    setLoading(true)

    // await new Promise((resolve) => setTimeout(resolve, 4000))

    try {
      const res = await fetch(`/api/users/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        })
      })
      const result = await res.json()

      if (!res.ok || !result.success) {
        if (res.status === 400) {
          setErrorMessage(result.message)
        }

        if (res.status === 500) {
          setErrorMessage("Failed to update your profile. Please try again later.")
        }
        throw new Error(result.message || "error")
      }

      if (res.ok && result.success) {
        setShowError(false)
      }

    } catch (err) {
      console.log(err, "failed editing")
      setShowError(true)
    } finally {
      setLoading(false)
    }
  };

  return { onSubmit, loading, showError, errorMessage }

}
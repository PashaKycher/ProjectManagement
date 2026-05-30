import { postData } from "@/lib/fetch-util";
import type { SignUpFormData } from "@/routes/auth/sign-up";
import { useMutation } from "@tanstack/react-query";

export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: async (data: SignUpFormData) => postData("/auth/register", data),
    })
};
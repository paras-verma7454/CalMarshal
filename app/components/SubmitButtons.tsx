"use client";

import { Button } from "@/components/ui/button";
import GoogleLogo from "@/public/google.svg"
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import GithubLogo from "@/public/github.svg"
import { cn } from "@/lib/utils";

export function GoogleAuthButton(){

    const {pending}= useFormStatus();

    return(
        <>
        {pending ? (
            <Button disabled variant={'outline'} className="w-full">
                 <Loader2 className="size-4 mr-2 animate-spin"/> Please wait
            </Button>
        ) : (
            <Button variant={'outline'} className="w-full">
                <Image src={GoogleLogo} alt={'Google logo'} className="size-4 mr-2" />
                Sign in with Google
            </Button>
        )}
        </>
    )
}

export function GitHubAuthButton() {
    const { pending } = useFormStatus();
    return (
      <>
        {pending ? (
          <Button variant="outline" className="w-full" disabled>
            <Loader2 className="size-4 mr-2 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button variant="outline" className="w-full">
            <Image src={GithubLogo} className="size-4 mr-2 dark:invert" alt="GitHub Logo" />
            Sign in with GitHub
          </Button>
        )}
      </>
    );
}


interface iAppProps{
  text: string,
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined,
  className?: string
}
export function SubmitButton({text, variant, className}: iAppProps) {
    const { pending } = useFormStatus();
    return (
      <>
        {pending ? (
          <Button variant="outline" className={cn("w-fit", className)} disabled>
            <Loader2 className="size-4 mr-2 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button type="submit" variant={variant} className={cn("w-fit", className)} >
            {text}
          </Button>
        )}
      </>
    );
}
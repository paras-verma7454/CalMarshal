import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod"

export const onboardingSchema=z.object({
    fullName: z.string().min(3).max(150),
    username: z.string().min(3).max(150).regex(/^[a-zA-Z0-9-]+$/,{
        message: "Username must contain only letters, numbers, and hyphens."
    }),

})

export function onboardingSchemaValidation(options?:{
    isUsernameUnique:()=> Promise<boolean>;
}){
    return z.object({
        username: z.string().min(3).max(150).regex(/^[a-zA-Z0-9-]+$/,{
            message: "Username must contain only letters, numbers, and hyphens."
        })
        .pipe(
            z.string().superRefine((_, ctx) =>{
                if(typeof options?.isUsernameUnique !== "function") {
                    ctx.addIssue({
                        code: 'custom',
                        message: conformZodMessage.VALIDATION_UNDEFINED,
                        fatal: true
                    })

                    return;
                }

                return options.isUsernameUnique().then((isUnique) => {
                    if(!isUnique){
                        ctx.addIssue({
                            code: 'custom',
                            message: "Username already exists",
                            fatal: true
                        })
                    }
                })
            })
        ),
        fullName: z.string().min(3).max(150),
    })
}


export const settingsSchema =z.object({
    fullName: z.string().min(3).max(150),
    profileImage: z.string()
})

export const eventTypeSchema = z.object({
    title: z.string().min(3).max(150),
    duration: z.number().min(15).max(150), //120
    url: z.string().min(3).max(150),
    description: z.string().min(3).max(300),
    videoCallSoftware: z.string().min(3),
});
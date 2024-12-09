"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { OnboardingAction } from "../action";
import { useForm } from '@conform-to/react';
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../lib/zodSchema";
import { SubmitButton } from "../components/SubmitButtons";

export default function OnboardingRoute() {

    const [lastResult, action]= useActionState(OnboardingAction, undefined);
    const [form,feilds]= useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData, {
                schema: onboardingSchema
            })
        },

        shouldValidate: 'onBlur',
        shouldRevalidate: "onInput"
    })

    return(
        <div className="min-h-screen w-screen flex items-center justify-center">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to Cal<span className="text-primary">Marshal</span></CardTitle>
                    <CardDescription>We need the following information to setup your profile!</CardDescription>
                </CardHeader>
                <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
                <CardContent className=" flex flex-col gap-y-5 ">
                    <div className="grid gap-y-2 ">
                        <Label>Full Name</Label>
                        <Input name={feilds.fullName.name} defaultValue={feilds.fullName.initialValue} key={feilds.fullName.key} placeholder="Paras Verma"/>
                        <p className="text-red-500 text-xs ">{feilds.fullName.errors}</p>
                    </div>
                    <div className="grid gap-y-2 ">
                        <Label>Username</Label>
                        <div className="flex rounded-md">
                            <span className="inline-flex items-center px-3  rounded-l-md border border-r-0 border-muted bg-muted test-sm text-muted-foreground">CalMarshal.com/</span>
                            <Input name={feilds.username.name} defaultValue={feilds.username.initialValue} key={feilds.username.key} placeholder="example-user-1" className="rounded-l-none "/>
                        </div>
                        <p className="text-red-500 text-xs ">{feilds.username.errors}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton text="Submit"  className="w-full"/>
                </CardFooter>
                </form>
            </Card>
        </div>
    )
}
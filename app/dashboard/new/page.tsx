"use client"
import { CreateEventTypeAction } from "@/app/action";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { eventTypeSchema } from "@/app/lib/zodSchema";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/buttonGroup";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import { useActionState, useState } from "react";


type Platform = "Zoom Meeting" | "Google Meet" | "Microsoft Teams";
export default function NewEventRoute(){

    const [activePlatform, setActivePlatform] = useState<Platform>("Google Meet");
    const [lastResult, action] = useActionState(CreateEventTypeAction, undefined);
    const [form,fields] = useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData,{
                schema: eventTypeSchema
            })
        },

        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })




    return(
        <div className="w-full h-full flex flex-1 items-center justify-center"> 
            <Card>
                <CardHeader>
                    <CardTitle>Add new appointment type</CardTitle>
                    <CardDescription>
                        Create a new appointment type that allows people to book your time.
                    </CardDescription>
                </CardHeader>
                <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
                    <CardContent className="grid gap-y-5">
                            <div className="flex flex-col gap-y-2">
                                <Label>Title</Label>
                                <Input name={fields.title.name} key={fields.title.key} defaultValue={fields.title.initialValue} placeholder="30 Minute Meeting"/>
                                <p className="text-red-500 text-xs">{fields.title.errors}</p>
                            </div>
                            <div className="flex flex-col gap-y-2">
                                {/* //URL Slug */}
                                <Label>URL Slug</Label>  
                                <div className="flex rounded-md">
                                    <span className="inline-flex items-center px-3 rounded-l-md border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                                        CalMarshal.com/
                                    </span>
                                    <Input name={fields.url.name} key={fields.url.key} defaultValue={fields.url.initialValue} placeholder="test-url-1" className="rounded-l-none"/>
                                </div>
                                <p className="text-red-500 text-xs">{fields.url.errors}</p>
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <Label>Description</Label>
                                <Textarea  name={fields.description.name} key={fields.description.key}
                                 defaultValue={fields.description.initialValue}
                                  placeholder="A quick video meeting."/>
                                <p className="text-red-500 text-xs">{fields.description.errors}</p>
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <Label>Duration</Label>
                                <Select name={fields.duration.name} key={fields.duration.key} defaultValue={fields.duration.initialValue}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select duration"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Duration</SelectLabel>
                                            <SelectItem value="15">15 Minutes</SelectItem>
                                            <SelectItem value="30">30 Minutes</SelectItem>
                                            <SelectItem value="45">45 Minutes</SelectItem>
                                            <SelectItem value="60">60 Minutes</SelectItem>
                                            <SelectItem value="90">90 Minutes</SelectItem>
                                            <SelectItem value="120">120 Minutes</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <p className="text-red-500 text-xs">{fields.duration.errors}</p>
                            </div>
                            <div className="grid gap-y-2">
                                <Label>Video Call Software</Label>
                                <input type="hidden" name={fields.videoCallSoftware.name} key={fields.videoCallSoftware.key} defaultValue={activePlatform}/>
                                <ButtonGroup className="w-full">

                                    <Button className="w-full" type="button"
                                        variant={ activePlatform === "Zoom Meeting" ? "default" : "outline"}
                                        onClick={() => setActivePlatform("Zoom Meeting")}
                                        > Zoom
                                    </Button>

                                    <Button className="w-full" type="button"
                                    variant={ activePlatform === "Google Meet" ? "default" : "outline"}
                                    onClick={() => setActivePlatform("Google Meet")}
                                        > Google Meet
                                    </Button>

                                    <Button className="w-full" type="button"
                                    variant={ activePlatform === "Microsoft Teams" ? "default" : "outline" }
                                    onClick={() => setActivePlatform("Microsoft Teams")}
                                        > Microsoft Teams
                                    </Button>

                                </ButtonGroup>
                                <p className="text-red-500 text-xs">{fields.videoCallSoftware.errors}</p>
                            </div>
                    </CardContent>
                    <CardFooter className="flex w-full justify-between">
                        <Button variant="secondary" asChild>
                            <Link href={"/dashboard"}>Cancel</Link>
                        </Button>
                        <SubmitButton text="Create Event Type"/>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
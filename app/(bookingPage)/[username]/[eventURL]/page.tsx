import { CreateMeetingAction } from "@/app/action";
import { RenderCalendar } from "@/app/components/bookingForm/RenderCalendar";
import { TimeTable } from "@/app/components/bookingForm/TimeTable";
import { SubmitButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarX2, Clock, VideoIcon } from "lucide-react";
import { notFound } from "next/navigation";



async function getData(eventUrl: string, userName: string){
    const data = await prisma.eventType.findFirst({
        where:{
            url: eventUrl,
            user:{
                username: userName
            },
            active: true
        },
        select:{
            id: true,
            description: true,
            title: true,
            duration: true,
            videoCallSoftware: true,
            user:{
                select:{
                    image: true,
                    name: true,
                    availability: {
                        select:{
                            day: true,
                            isActive: true,
                            
                        }
                    }
                }
            }
        }

    })

    if(!data){
        return notFound();
    }

    return data;
}


export default async function BookingFormRoute({params, searchParams}:{
    params: Promise<{ username: string; eventUrl: string }>;
    searchParams: Promise<{ date?: string; time?: string }>
}){
    
      // Await the params and searchParams to resolve them before accessing their properties
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const { username, eventUrl } = resolvedParams;
    const { date, time } = resolvedSearchParams;

    // Fetch the necessary data
    const data = await getData(eventUrl, username);

    // Process the selected date
    const selectedDate = date ? new Date(date) : new Date();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
    }).format(selectedDate);

    // Show the form only if date and time are provided
    const showForm = !!date && !!time;


    return(
        <div className="min-h-screen w-screen flex items-center justify-center">
            {showForm ? (
                <Card className="max-w-[800px] w-full">
                <CardContent className="p-5 md:grid md:grid-cols-[1fr,auto,1fr] md:gap-4">
                    <div>
                        <img src={data.user.image as string} alt="Profile Image" className="size-20 rounded-xl"/>
                        <p className="text-sm font-medium text-muted-foreground mt-1 ">{data.user.name}</p>
                        <Separator className="mt-2"/>
                        <h1 className="text-xl font-semibold mt-2 ">{data.title}</h1>
                        <p className="text-sm text-muted-foreground font-medium">{data.description}</p>
                        <div className="mt-5 flex flex-col gap-y-3">
                            <p className="flex items-center">
                                <CalendarX2 className="size-4 mr-2 text-primary"/>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {formattedDate}
                                </span>
                            </p>
                            <p className="flex items-center">
                                <Clock className="size-4 mr-2 text-primary"/>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {data.duration} Minutes
                                </span>
                            </p>
                            <p className="flex items-center">
                                <VideoIcon className="size-4 mr-2 text-primary"/>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {data.videoCallSoftware}
                                </span>
                            </p>
                        </div>
                    </div>

                    <Separator orientation="vertical" />
                    
                    <form className="flex flex-col gap-y-4" action={CreateMeetingAction}>
                        
                        <input type="hidden" name="fromTime" value={time}/>
                        <input type="hidden" name="eventDate" value={date}/>
                        <input type="hidden" name="meetingLength" value={data.duration}/>
                        <input type="hidden" name="provider" value={data.videoCallSoftware}/>
                        <input type="hidden" name="username" value={username}/>
                        <input type="hidden" name="eventTypeId" value={data.id}/>

                        <div className="flex flex-col gap-y-2">
                            <Label>Their Name</Label>
                            <Input name="name" placeholder="Their Name" />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label>Their Email</Label>
                            <Input name="email" placeholder="Jhondoe@gmail.com" />
                        </div>
                        <SubmitButton className="w-full mt-5 " text="Book Meeting"/>
                    </form>

                </CardContent>
            </Card>
            ) : (
                <Card className="max-w-[1000px] w-full mx-auto">
                <CardContent className="p-5 md:grid md:grid-cols-[1fr,auto,1fr,auto,1fr] md:gap-4">
                    <div>
                        <img src={data.user.image as string} alt="Profile Image" className="size-20 rounded-xl"/>
                        <p className="text-sm font-medium text-muted-foreground mt-1 ">{data.user.name}</p>
                        <Separator className="mt-2"/>
                        <h1 className="text-xl font-semibold mt-2 ">{data.title}</h1>
                        <p className="text-sm text-muted-foreground font-medium">{data.description}</p>
                        <div className="mt-5 flex flex-col gap-y-3">
                            <p className="flex items-center">
                                <CalendarX2 className="size-4 mr-2 text-primary"/>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {formattedDate}
                                </span>
                            </p>
                            <p className="flex items-center">
                                <Clock className="size-4 mr-2 text-primary"/>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {data.duration} Minutes
                                </span>
                            </p>
                            <p className="flex items-center">
                                <VideoIcon className="size-4 mr-2 text-primary"/>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {data.videoCallSoftware}
                                </span>
                            </p>
                        </div>
                    </div>

                    <Separator orientation="vertical" />

                    
                    <RenderCalendar availability={data.user.availability}/>
                    

                    <Separator orientation="vertical" />
                    <TimeTable selectedDate={selectedDate} userName={username} meetingDuration={data.duration}/>

                </CardContent>
            </Card>
             )}
        </div>
    )
}
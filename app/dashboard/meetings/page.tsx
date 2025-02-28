
import prisma from "@/app/lib/db";
import { nylas } from "@/app/lib/nylas";
import { requireUser } from "@/app/lib/hooks";
import { EmptyState } from "@/app/components/EmptyState";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, fromUnixTime } from "date-fns";
import { Video } from "lucide-react";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { Separator } from "@/components/ui/separator";
import { CancelMeetingAction } from "@/app/action";

async function getData(userId: string) {
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        grantEmail: true,
        grantId: true,
      },
    });
  
    if (!userData) {
      throw new Error("User not found")
    }
  
    const data = await nylas.events.list({
        identifier: userData.grantId as string,
        queryParams:{
            calendarId: userData.grantEmail as string,
        }
    })

    return data;
}

export default async function MeetingsRoute(){
    
    const session = await requireUser();
    const data = await getData(session.user?.id as string);
    // console.log(data.data[0].when)
    return(
        <>
            {data.data.length < 1 ? (
                <EmptyState title="No meetings found" description="You don't have any meetings scheduled" buttonText="Create a new Event type" href="/dashboard/new"/>
            ): (
                <Card>
                    <CardHeader>
                        <CardTitle>Bookings</CardTitle>
                        <CardDescription>
                            See upcoming event which were booked with you and see the event type link.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.data.map((item)=>(

                            <form action={CancelMeetingAction} key={item.id}>
                                <input type="hidden" name="eventId" value={item.id}/>
                                <div className="grid grid-cols-3 justify-between items-center">
                                    <div>
                                        <p className="text-muted-foreground text-sm ">
                                            {/* @ts-ignore */}
                                            {item.when?.startTime ? ( format(fromUnixTime(item.when.startTime > 9999999999 ? item.when.startTime / 1000 : item.when.startTime), "EEE, d MMM")
                                            ) : (
                                                <span className="text-red-500">Invalid Date</span>
                                            )}

                                        </p>
                                        <p className="text-muted-foreground text-xs pt-1">
                                            {/* @ts-ignore */}  
                                            {format(fromUnixTime(item.when.startTime), "hh:mm a")} - {format(fromUnixTime(item.when.endTime), "hh:mm a")}
                                        </p>

                                        <div className="flex items-center mt-1">
                                            <Video className="size-4 mr-2 text-primary"/>
                                            {/* @ts-ignore */}
                                            <a href={item.conferencing.details.url} target="_blank" className="text-xs text-primary underline underline-offset-4">Join Meeting</a>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start">
                                        <h2 className="text-sm font-medium">{item.title}</h2>
                                        <p className="text-sm text-muted-foreground">You and {item.participants[0].name}</p>
                                    </div>

                                    <SubmitButton text="Cancel Event" variant="destructive" className="w-fit flex ml-auto"/>
                                
                                </div>
                                <Separator className="my-3"/>
                            </form>

                        ))}
                    </CardContent>
                </Card>
            )}
        </>
    )
}
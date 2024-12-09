import { DeleteEventTypeAction } from "@/app/action";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function DeleteEventType({params}:{params:Promise<{eventTypeId:string}>}){

    const {eventTypeId} = await params;
    return(
        <div className="flex flex-1 items-center justify-center">
            <Card>
                <CardHeader>
                    <CardTitle>Delete Evemt Type</CardTitle>
                    <CardDescription>
                        Are you sure you want to delete this event type?
                    </CardDescription>
                </CardHeader>
                <CardFooter className="w-full flex justify-between">
                    <Button asChild variant={"secondary"}>
                        <Link href={"/dashboard"}>
                            Cancel
                        </Link>
                    </Button>
                    <form action={DeleteEventTypeAction}>
                        <input type="hidden" name="id" value={eventTypeId}/>
                        <SubmitButton text="Delete Event" variant={"destructive"}/>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}
import { UpdateAvalabiltyAction } from "@/app/action";
import { SubmitButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import convertTime12Hrs from "@/app/lib/TimeChange";
import { times } from "@/app/lib/times";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";
import { getLocalTimeZone } from "@internationalized/date";

const timeZones = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Europe/Paris",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
  // ...add more as needed
];

async function getData(userId: string): Promise<Array<{ id: string; day: string; fromTime: string; tillTime: string; isActive: boolean; createdAt: Date; updatedAt: Date; userId: string; timeZone: string }>> {
    const weekOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const data = await prisma.availability.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            // Use the day field to sort alphabetically
            day: "asc"
        }
    });

    if (!data) {
        return notFound();
    }

    // Sort the data by the custom week order
    const sortedData = data.sort((a, b) => {
        return weekOrder.indexOf(a.day) - weekOrder.indexOf(b.day);
    });

    // console.log(sortedData);

    return sortedData;
}

export default async function AvailabilityRoute() {

    const session =await requireUser();
    const data= await getData(session.user?.id as string);
    // Fetch the user's time zone from the first availability row, or default to local
    const userTimeZone = data[0]?.timeZone || getLocalTimeZone();
    
    

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Availability</CardTitle>
                    <CardDescription>
                        In this section you can manage the availability!
                    </CardDescription>
                </CardHeader>
                <form action={UpdateAvalabiltyAction}>
                    <CardContent className="flex flex-col gap-y-4 ">
                        <div className="mb-4">
                          <label className="block mb-1 font-medium">Time Zone</label>
                          <Select name="timeZone" defaultValue={userTimeZone}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={"Select time zone"}/>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {timeZones.map((tz) => (
                                  <SelectItem value={tz} key={tz}>{tz}</SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        {data.map((item)=>{
                            return(
                                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4">
                                    <input type="hidden" name={`id-${item.id}`} value={item.id}/>
                                    <div className="flex items-center gap-x-3 ">
                                        <Switch name={`isActive-${item.id}`} defaultChecked={item.isActive}/>
                                        <p>{item.day}</p>
                                    </div>
                                    <Select name={`fromTime-${item.id}`} defaultValue={item.fromTime}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={"From time"}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                               {times.map((time)=>{
                                                return(
                                                    <SelectItem value={time.time} key={time.id}>
{/*                                                         {convertTime12Hrs(time.time)} */}
                                                        {time.time}
                                                    </SelectItem>
                                                )
                                               })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <Select name={`tillTime-${item.id}`} defaultValue={item.tillTime}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={"Till time"}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                               {times.map((time)=>{
                                                return(
                                                    <SelectItem value={time.time} key={time.id}>
{/*                                                         {convertTime12Hrs(time.time)} */}
                                                        {time.time}
                                                    </SelectItem>
                                                )
                                               })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        })}
                    </CardContent>
                    <CardFooter>
                        <SubmitButton text="Save Changes"/>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

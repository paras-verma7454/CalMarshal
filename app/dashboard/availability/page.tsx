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


async function getData(userId: string){
    const data= await prisma.availability.findMany({
        where:{
            userId: userId
        }
    })

    if(!data){
        return notFound();
    }
    data.sort((a, b) => {
        const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
    });
    
    return data;
}
export default async function AvailabilityRoute() {

    const session =await requireUser();
    const data= await getData(session.user?.id as string);
    
    

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
                                                        {convertTime12Hrs( time.time)}
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
                                                        {convertTime12Hrs(time.time)}
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

import { notFound } from "next/navigation";
import prisma from "../lib/db";
import { requireUser } from "../lib/hooks"
import { EmptyState } from "../components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Pen, Settings, Trash, Users2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CopyLinkMenuItem } from "../components/CopyLinkMenu";
import MenuActiveSwitch from "../components/EventTypeSwitcher";


 async function getData(userId: string){
    const data= await prisma.user.findUnique({
        where:{
            id: userId
        },
        select:{
            username:true,
            eventType:{
                select:{
                    id: true,
                    active: true,
                    title:true,
                    url:true,
                    duration:true
                }
            }
        }
    })

    if(!data){
        return notFound();
    }

    return data;
}
export default async function DashboardPage(){

    const session =await requireUser();
    const data= await getData(session.user?.id as string);

    return(
        <>
            {data.eventType.length === 0 ? (
                <EmptyState
                title="You have no Event Types"
                description="You can create your first event type by clicking the button below."
                buttonText="Add Event Type"
                href="/dashboard/new"
              />
            ) : (
                <>
                    <div className="flex items-center justify-between px-2">
                        <div className="hidden sm:grid gap-y-1">
                            <h1 className="text-3xl font-semibold">Event Types</h1>
                            <p className="text-muted-foreground">Create and manage your event types here</p>
                        </div>
                        <Button>
                            <Link href={'/dashboard/new'}>
                                Create New Event
                            </Link>
                        </Button>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {data.eventType.map((item) => (
                                <div key={item.id} className="overflow-hidden shadow rounded-lg border relative">
                                    <div className="absolute top-2 right-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant={'outline'} size={"icon"} >
                                                    <Settings className="size-4"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Event</DropdownMenuLabel>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/${data.username}/${item.url}`}>
                                                        <ExternalLink className="size-4"/>
                                                        Preview
                                                    </Link>
                                                </DropdownMenuItem>

                                               <CopyLinkMenuItem meetingUrl={`${process.env.NEXT_PUBLIC_URL}/${data.username}/${item.url}`}/>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/event/${item.id}`}>
                                                        <Pen className="size-4"/>
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/event/${item.id}/delete`}>
                                                        <Trash className="size-4"/>
                                                        Delete Event
                                                    </Link>
                                                    
                                                </DropdownMenuItem>

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <Link href={'/'} className="flex items-center p-5">
                                        <div className="flex shrink-0 ">
                                            <Users2 className="size-6"/>
                                        </div>

                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dd className="text-lg font-medium">
                                                    {item.title}
                                                </dd>
                                                <dt className="text-xs font-medium text-muted-foreground">
                                                    {item.duration} Minutes Meeting
                                                </dt>
                                            </dl>
                                        </div>
                                    </Link>
                                    <div className="bg-muted dark:bg-gray-900 px-5 py-3 flex justify-between items-center">
                                        <MenuActiveSwitch eventTypeId={item.id} initalChecked={item.active} />
                                            <Button asChild>
                                                <Link href={`/dashboard/event/${item.id}`}>
                                                Edit Event
                                                </Link>
                                            </Button>
                                    </div>

                                </div>
                            
                        ))}
                    </div>
                </>
            )}
        </>
    )
}
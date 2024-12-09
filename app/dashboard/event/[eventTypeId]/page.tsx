import EditEventTypeForm from "@/app/components/EditEventTypeForm";
import prisma from "@/app/lib/db"
import { notFound } from "next/navigation"

async function getData(eventTypeId: string){
    const data = await prisma.eventType.findUnique({
        where:{
            id: eventTypeId
        },
        select:{
            title: true,
            description: true,
            duration: true,
            url: true,
            id: true,
            videoCallSoftware: true
        }
    })

    if(!data){
        return notFound();
    }

    return data;
}

export default async function EditRoute({params}:{params:Promise<{eventTypeId:string}>}){

    const {eventTypeId} = await params;
    const data = await getData(eventTypeId);

    return (
        <EditEventTypeForm id={data.id} title={data.title} url={data.url} description={data.description} duration={data.duration} callProvider={data.videoCallSoftware}/>
    )
}
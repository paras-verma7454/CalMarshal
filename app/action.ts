"use server"

import prisma from "./lib/db"
import { requireUser } from "./lib/hooks"
import { parseWithZod } from '@conform-to/zod';
import { eventTypeSchema, onboardingSchemaValidation, settingsSchema } from "./lib/zodSchema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nylas } from "./lib/nylas";


export async function OnboardingAction(prevState: any,formdata: FormData) {
    const session= await requireUser();
    
    const submission= await parseWithZod(formdata,{
        schema: onboardingSchemaValidation({
            async isUsernameUnique() {
                const existingUsername= await prisma.user.findUnique({
                    where:{
                        username: formdata.get("username") as string
                    }
                })
                return !existingUsername;
            },
        }),
        async: true
    })

    if(submission.status !== "success") {  
        return submission.reply()
    }

    const data=  await prisma.user.update({
        where:{
            id: session.user?.id
        },
        data:{
            username: submission.value.username,
            name: submission.value.fullName,
            availability:{
                createMany:{
                    data:[
                        {
                            day: 'Monday',
                            fromTime: '08:00',
                            tillTime: '18:00'
                        },{
                            day: 'Tuesday',
                            fromTime: '08:00',
                            tillTime: '18:00'
                        },{
                            day: 'Wednesday',
                            fromTime: '08:00',
                            tillTime: '18:00'
                        },{
                            day: 'Thursday',
                            fromTime: '08:00',
                            tillTime: '18:00'
                        },{
                            day: 'Friday',
                            fromTime: '08:00',
                            tillTime: '18:00'
                        },{
                            day: 'Saturday',
                            fromTime: '08:00',
                            tillTime: '18:00'
                        },{
                            day: 'Sunday',
                            fromTime: '08:00',
                            tillTime: '18:00'
                        }
                    ]
                }
            }
        }
    })

    return redirect('/onboarding/grant-id');
}


export async function SettingsAction(prevState: any,formdata: FormData) {
    const session= await requireUser();

    const submission = parseWithZod(formdata,{
        schema: settingsSchema
    })

    if(submission.status !== "success") {
        return submission.reply();
    }

    const user = await prisma.user.update({
        where:{
            id: session.user?.id
        },
        data:{
            name: submission.value.fullName,
            image: submission.value.profileImage
        }
    })

    return redirect('/dashboard');
}

export async function UpdateAvalabiltyAction(formdata: FormData) {
    const rawData=  Object.fromEntries(formdata.entries());
    const availabilityData = Object.keys(rawData).filter((key)=> key.startsWith("id-")).map((key)=>{
        const id= key.replace("id-","")

        return{
            id,
            isActive:rawData[`isActive-${id}`] ==="on",
            fromTime: rawData[`fromTime-${id}`] as string,
            tillTime: rawData[`tillTime-${id}`] as string
        }
    })

    try{
        await prisma.$transaction(
             availabilityData.map((item)=> prisma.availability.update({
                where:{
                    id: item.id
                },
                data:{
                    isActive: item.isActive,
                    fromTime: item.fromTime,
                    tillTime: item.tillTime
                }
             }))
        )

        revalidatePath("/dashboard/availability");
    }catch(e){
        console.log("Error",e);
    }
}

export async function CreateEventTypeAction(prevState: any,formdata: FormData) {
    const session = await requireUser();
    const submission = parseWithZod(formdata,{
        schema: eventTypeSchema,
    })

    if(submission.status !== "success" ){
        return submission.reply();
    }
    
    await prisma.eventType.create({
        data:{ 
            title: submission.value.title,
            duration: submission.value.duration,
            url: submission.value.url,
            description: submission.value.description,
            userId: session.user?.id as string,
            videoCallSoftware: submission.value.videoCallSoftware
        }
    })

    return redirect('/dashboard');
}

export async function CreateMeetingAction(formdata: FormData) {
    const getUserData = await prisma.user.findUnique({
        where:{
            username: formdata.get('username') as string,
        },
        select:{
            grantEmail:true,
            grantId: true
        }
    })

    if(!getUserData){
        throw new Error("User not found")
    }

    const eventTypeData = await prisma.eventType.findUnique({
        where:{
            id:formdata.get('eventTypeId') as string,
        },
        select:{
            title: true,
            description: true,
        }
    })

    const fromTime = formdata.get('fromTime') as string;
    const eventDate = formdata.get('eventDate') as string;

    const meetingLength= Number(formdata.get('meetingLength'));
    const provider = formdata.get('provider') as string;

    const startDateTime = new Date(`${eventDate}T${fromTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

    await nylas.events.create({
        identifier:getUserData.grantId as string,
        requestBody:{
            title: eventTypeData?.title,
            description: eventTypeData?.description,
            when:{
                startTime: Math.floor(startDateTime.getTime()/1000),
                endTime: Math.floor(endDateTime.getTime()/1000)
            },
            conferencing:{
                autocreate: {},
                provider: provider as any
            },
            participants:[{
                name: formdata.get('name') as string,
                email: formdata.get('email') as string,
                status: "yes"
            }]
        },
        queryParams:{
            calendarId: getUserData.grantEmail as string,
            notifyParticipants:true
        }
    })

    return redirect("/success")
}

export async function CancelMeetingAction(formdata: FormData){
    const session = await requireUser();

    const userData = await prisma.user.findUnique({
        where:{
            id: session.user?.id
        },
        select:{
            grantEmail: true,
            grantId: true
        }
    })

    if(!userData){
        throw new Error("User not found");
    }
    const data = await nylas.events.destroy({
        eventId: formdata.get('eventId') as string,
        identifier: userData.grantId as string,
        queryParams:{
            calendarId: userData.grantEmail as string
        }
    })

    revalidatePath("/dashboard/meetings")
}


export async function EditEventTypeAction(prevState: any,formdata: FormData){
    const session = await requireUser();

    const submission =  parseWithZod(formdata, {
        schema: eventTypeSchema
    })

    if(submission.status !== "success"){
        return submission.reply();
    }

    const data = await prisma.eventType.update({
        where:{
            id: formdata.get("id") as string,
            userId: session.user?.id
        },
        data:{
            title: submission.value.title,
            duration: submission.value.duration,
            url: submission.value.url,
            description: submission.value.description,
            videoCallSoftware: submission.value.videoCallSoftware
        }
    })

    return redirect("/dashboard");
}

export async function UpdateEventTypeStatusAction(prevState: any,{eventTypeId, isChecked}:{
    eventTypeId: string,
    isChecked: boolean
}){
    try{
        const session = await requireUser();

        const data = await prisma.eventType.update({
            where:{
                id: eventTypeId,
                userId: session.user?.id
            },
            data:{
                active: isChecked
            }
        })

        revalidatePath("/dashboard")

        return {
            status: "success",
            message: "Event type status updated successfully"
        }
    }catch (err) {
        return {
            status: "error",
            message: "Failed to update event type status"
        }
    }
}

export async function DeleteEventTypeAction(formdata: FormData) {
    const session = await requireUser();

    // Validate that the user is authorized to delete the event type
    if (!session || session.user?.id !== formdata.get("userId")) {
        throw new Error("Unauthorized action");
    }

    try {
        await prisma.eventType.delete({
            where: {
                id: formdata.get("id") as string,
                userId: session.user?.id
            }
        });

        // Redirect to the dashboard upon successful deletion
        return redirect("/dashboard");
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete the event type");
    }
}

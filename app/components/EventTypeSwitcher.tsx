"use client";

import { Switch } from "@/components/ui/switch";

import { UpdateEventTypeStatusAction } from "../action";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";

export  default function MenuActiveSwitch({initalChecked, eventTypeId}:{
    initalChecked: boolean,
    eventTypeId: string
}){
    const [isPending, startTransition] = useTransition();
    const [state, action] = useActionState(UpdateEventTypeStatusAction, undefined);

    useEffect(()=>{
        if(state?.status === "success"){
            toast.success(state.message);
        }
        else if(state?.status === "error"){
            toast.error(state.message);
        }
    },[state])

    return(
        <Switch 
            defaultChecked={initalChecked}
            disabled={isPending}
            onCheckedChange={(isChecked)=>{
                 startTransition(()=>{
                    action({
                        eventTypeId,
                        isChecked
                    })
                })
            }}
        />
    )
}


